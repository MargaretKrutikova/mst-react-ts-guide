import {
  destroy,
  types,
  getParent,
  Instance,
  cast,
  getEnv
} from "mobx-state-tree"

import { PollBase, PollChoiceBase } from "./PollBase"
import { PublishedPollsModel } from "./PublishedPolls"

// Instance is a typescript helper that extracts the type of the model
export type PollDraftChoiceModel = Instance<typeof PollDraftChoice>
export type PollDraftModel = Instance<typeof PollDraft>

export type PollDraftEnv = {
  publishedPolls: PublishedPollsModel
}

export const PollDraftChoice = PollChoiceBase.actions(self => ({
  setChoice(choice: string) {
    self.value = choice
  },
  remove() {
    // "2 levels up" - first "items" property, then PollDraft itself
    const pollDraftParent = getParent<PollDraftModel>(self, 2)

    // "self" here is of type what was before views and actions were applied, so need to cast explicitly
    pollDraftParent.removeChoice(cast(self))
  }
}))

export const PollDraft = types
  .compose(
    PollBase,
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
    },
    addChoice(choice: string) {
      self.choices.push({ value: choice })
    },
    removeChoice(choiceToRemove: PollDraftChoiceModel) {
      destroy(choiceToRemove)
    },
    publish() {
      const env = getEnv<PollDraftEnv>(self)
      env.publishedPolls.publishDraft(cast(self))
    }
  }))
