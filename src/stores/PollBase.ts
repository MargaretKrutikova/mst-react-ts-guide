import { types } from "mobx-state-tree"

export const PollChoiceBase = types.model("PollChoiceBase", {
  value: types.string
})

export const PollBase = types.model("PollBase", {
  question: "",
  isMultiChoice: false,
  choices: types.optional(types.array(PollChoiceBase), [])
})
