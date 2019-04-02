import { types } from "mobx-state-tree"

export const PollChoiceBase = types.model("PollChoiceBase", {
  id: types.identifier,
  value: types.optional(types.string, "")
})

export const PollBase = types.model("PollBase", {
  question: "",
  choices: types.optional(types.array(PollChoiceBase), [])
})
