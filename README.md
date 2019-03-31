# How to: mobx-state-tree + react + typescript

This is a walkthrough on how to get started with `mobx-state-tree` and connect it to `react` components in a `CRA` app with `typescript`.

In the process of trying to learn `mobx-state-tree` and to use it in a `react` app written in `typescript` I felt that there were a few missing pieces that I had to struggle with. Eventually when everything fell in place I thought it would be useful to summarize and explain the steps I followed in order to make `mobx-state-tree` & `react` & `typescript` to play nicelly together.

The application I build is a simple poll maker that allows to create a new poll, publish it, view and delete published polls.

The guide assumes some familiarity with `mobx-state-tree` as it doesn't go through the theoretical part of the library but rather the practical example on how to make things work.

# Content

- [Setup stores in mst]()
  - [Create a base model]()
  - [Use composition to create domain stores]()
  - [CRUD on models in a nested list]()
  - [Create a root store]()
  - [Communicate between stores]()
- [Connect react to mobx]()
  - [Use context provider to pass store(s)]()
  - [Create custom hook to inject stores]()

## Setup stores in mobx-state-tree

These are the steps I identified in the process of designing stores for the domain area of my app:

- create a base model and use composition to extend it with properties and functionality in different stores,
- create a store with a nested list of items representing another model and perform CRUD operations on it,
- create a root store composing all the other domain stores,
- communicate between stores.

I figured those might be common problems faced when designing stores for any domain area, so I will go through the steps in more detail and show my solutions.

In the poll maker app there is going to be a base model `PollBase`, a store responsible for creating a new poll `PollDraft`, a model for a published poll `PublishedPoll` and a store for published polls `PublishedPolls`.

### Create a base model

Before we start, install the necessary dependencies:

```
yarn add mobx mobx-state-tree
```

Now we need to identify base properties of the domain object `poll`:

- poll question,
- whether it is multi choice poll,
- a list of choices, where a choice is represented with just a string property.

The code for the models:

```
import { types } from "mobx-state-tree";

const PollChoiceBase = types.model("PollChoiceBase", {
  value: types.string
})

const PollBase = types.model("PollBase", {
  question: "",
  isMultiChoice: false,
  choices: types.optional(types.array(PollChoiceBase), [])
})

```

### Use composition to create domain stores

A poll that is being edited (let's call it a draft poll) and not yet published will have the same properties as `PollBase`, but also actions allowing to edit those properties. Similar, a choice of the draft poll will have the same shape as `PollChoiceBase` but also an action to update it:

```
const PollDraftChoice = PollChoiceBase.actions(self => ({
  setChoice(choice: string) {
    self.value = choice
  }))

const PollDraft = types
  .compose(PollBase,
    types.model({
      choices: types.optional(types.array(PollDraftChoice), [])
    })
  )
  .actions(self => ({
    setQuestion(question: string) {
      self.question = question
    },
    setMultiChoice(isMultiChoice: boolean) {
      self.isMultiChoice = isMultiChoice
    }
}))
```

A published poll can no longer be edited, so it won't have editing actions but it needs an extra property `id` to be able to find it or link to it by its id:

```
const PublishedPoll = types
  .compose(PollBase,
    types.model({
      id: types.identifier
    })
  )
```

### CRUD on models in a nested list

A draft poll has a list of choices of type `PollDraftChoice`, that can be added, read, edited and removed. Currently we have an action to update a choice (`setChoice`), but there are no actions to remove an existing choice or add a new one.

The tricky part here is removal. Since actions can only modify the model they belong to or their children, the `PollDraftChoice` model can't remove itself and can only be removed in its parent `PollDraft` since it "owns" the list of choices. This means `PollDraftChoice` model will need a `remove` action which will delegate its removal to `PollDraft` which is fetched via `getParent` helper from `mobx-state-tree`.

Here is the code:

```
import { destroy, getParent, Instance, cast } from "mobx-state-tree"

// Instance is a typescript helper that extracts the type of the model instance
type PollDraftChoiceModel = Instance<typeof PollDraftChoice>
type PollDraftModel = Instance<typeof PollDraft>

const PollDraftChoice = PollChoiceBase.actions(self => ({
  ...
  remove() {
    // "2" passed inside getParent means "2 levels up" until you reach PollDraft
    const pollDraftParent = getParent<PollDraftModel>(self, 2)

    // the type of "self" doesn't include actions and views so need to cast explicitly
    pollDraftParent.removeChoice(cast(self))
  }
}))

const PollDraft = types
  .compose(PollBase,
    types.model({
      choices: types.optional(types.array(PollDraftChoice), [])
    })
  )
  .actions(self => ({
    ...
    addChoice(choice: string) {
      self.choices.push({ value: choice })
    },
    removeChoice(choiceToRemove: PollDraftChoiceModel) {
      destroy(choiceToRemove)
    }
}))

```

Here is what is happening inside the choice model:

- `getParent<PollDraftModel>(self, 2)` means "2 levels up" - one until you reach `items` property and one more until you reach `PollDraft` itself, and the returned parent is going to be of type `PollDraftModel`.
- `pollDraftParent.removeChoice(cast(self))` uses [`cast`](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/API/README.md#cast) helper to tell typescript that `self` is of the chocie instance type. The problem is that `self` here is of type what was [before views and actions are applied](https://github.com/mobxjs/mobx-state-tree#typing-self-in-actions-and-views), which means
  it is actually not of type `PollDraftChoiceModel`, so `pollDraftParent.removeChoice(self)` won't compile in TS.

Last thing, let's create our second domain store to keep track of published polls:

```
type PollDraftModel = Instance<typeof PollDraft>

const PublishedPolls = types
  .model({
    polls: types.optional(types.array(PublishedPoll), [])
  })
  .actions(self => ({
    publishDraft(pollDraft: PollDraftModel) {
      const pollToPublish = { ...pollDraft, id: shortid() }
      self.polls.push(pollToPublish)
    }))
```

Here `publishDraft` accepts a draft poll to be published, generates an id with `shortid` library and adds the new poll to the list of polls.

Next problem is that `publishDraft` action has to be called somewhere from outside, either from the `PollDraft` store or from some kind of `RootStore`. Let's see how we can make them communicate.

### Create a root store

Root store combines all the stores that are going to be used in the app: `PollDraft` and `PublishedPolls`:

```
type RootStoreModel = Instance<typeof RootStore>

const RootStore = types.model("RootStore", {
  pollDraft: PollDraft,
  publishedPolls: PublishedPolls
})
```

### Communicate between stores

One way of communicating between stores, is to use `getParent`. This however works fine for tightly coupled stores (like `PollDraft` and `PollDraftChoice`), but won't scale if used in more decoupled stores.

## Connect react to mobx

The part I struggled most with is how to connect `react` to `mobx` and start using stores in my components. The idea here is that react components need to become "reactive" and start tracking observables from the stores.

The most common way to achieve this is by using [mobx-react](https://github.com/mobxjs/mobx-react) which provides `observer` and `inject` functions. `observer` is wrapped around components which makes them react to changes and re-render. `inject` just injects stores into components.

My attempt to use this library failed miserably because:

- when using `observer`, the component loses the ability to use hooks because it gets converted to a class, see this [github issue](https://github.com/mobxjs/mobx-react/issues/594) for more detail. And the docs recommend in the [best practices](https://mobx.js.org/best/pitfalls.html) to use `observer` around as many components as possible, which means hooks can't be used almost anywhere,
- `inject` function is quite compilcated and doesn't play nicely with typescript (see [github issue](https://github.com/mobxjs/mobx-react/issues/256#issuecomment-433587230)), requiring all stores be marked as optional and then using `!` to indicate that they actually do exist.

Luckily there is another library, [`mobx-react-lite`](https://github.com/mobxjs/mobx-react-lite), which is built with hooks and provides `observer` wrapper. One thing worth mentioning, its `observer` doesn't support classes, but there is a dedicated component `Observer` that can be wrapped around components in render.

But not so fast.. The library has a lot of built-in hooks like `useObservable`, `useComputed` etc. but they are going to be deprecated according to [this github issue](https://github.com/mobxjs/mobx-react-lite/issues/94). Instead here is a recommended way (more in this [github issue comment](https://github.com/mobxjs/mobx-react/issues/256#issuecomment-433587230)):

- use `react context` provider to pass down the store(s),
- access the store using `useContext` hook with a selector, alternatively inject the necessary stores with a custom `useInject` hook based on the `useContext` hook,
- use `observer` from `mobx-react-lite` to subscribe to changes.

As a bonus, I created a custom `connect` HOC function that resembles `redux`'s way of connecting to the store, which I will show later.

First thing, install the library:

```
yarn add mobx-react-lite
```

### Use context provider to pass store(s)

First, create a context in `StoreProvider.ts` exporting provider and a custom hook for accessing to the context value:

```
import { useContext, createContext } from "react"
import { RootStoreModel } from "./stores/RootStore"
import { createStore } from "./stores/createStore"

const rootStore = createStore()

const StoreContext = createContext<RootStoreModel>(rootStore)

export const useStore = () => useContext(StoreContext)
export const StoreProvider = StoreContext.Provider
```

### Create custom hook to inject stores]()
