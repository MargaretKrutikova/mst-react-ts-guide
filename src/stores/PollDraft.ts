import {
  destroy,
  types,
  getParent,
  Instance,
  cast,
  getEnv,
  getSnapshot,
  SnapshotIn
} from "mobx-state-tree"

import { PollBase, PollChoiceBase } from "./PollBase"
import { RootStoreEnv } from "./RootStore"
import shortid from "shortid"

// Instance is a typescript helper that extracts the type of the model
export type PollDraftChoiceModel = Instance<typeof PollDraftChoice>
export type PollDraftModel = Instance<typeof PollDraft>

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
    addChoice(choice: string) {
      self.choices.push({ id: shortid(), value: choice })
    },
    removeChoice(choiceToRemove: PollDraftChoiceModel) {
      destroy(choiceToRemove)
    },
    publish() {
      const { choices, question } = getSnapshot(self)
      const nonEmptyChoices = choices.filter(choice => !!choice)

      if (question && nonEmptyChoices.length > 0) {
        const env = getEnv<RootStoreEnv>(self)
        const pollToPublish: SnapshotIn<typeof PollDraft> = {
          question,
          choices: nonEmptyChoices
        }
        env.publishedPolls.publishDraft(pollToPublish)
      }
    }
  }))
