import RootStore, { RootStoreModel, RootStoreEnv } from "./RootStore"
import { PollDraft } from "./PollDraft"
import { PublishedPolls, PublishedPollModel } from "./PublishedPolls"
import shortid from "shortid"
import { SnapshotIn } from "mobx-state-tree"

const publishedPollData: SnapshotIn<PublishedPollModel> = {
  id: shortid(),
  question: "Is it going to rain tomorrow?",
  choices: [
    { id: shortid(), value: "Yeah" },
    { id: shortid(), value: "No" },
    { id: shortid(), value: "Dunno" }
  ]
}

// could possibly accept some initial state
export const createStore = (): RootStoreModel => {
  const publishedPolls = PublishedPolls.create({
    polls: [publishedPollData]
  })
  const pollDraft = PollDraft.create({
    choices: [{ id: shortid(), value: "" }]
  })

  const env: RootStoreEnv = { publishedPolls }

  const rootStore = RootStore.create(
    {
      pollDraft,
      publishedPolls
    },
    env
  )

  return rootStore
}
