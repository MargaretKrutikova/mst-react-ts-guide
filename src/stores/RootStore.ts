import { types, Instance } from "mobx-state-tree"
import { PollDraft } from "./PollDraft"
import { PublishedPolls, PublishedPollsModel } from "./PublishedPolls"

export type RootStoreModel = Instance<typeof RootStore>
export type RootStoreEnv = {
  publishedPolls: PublishedPollsModel
}

const RootStore = types.model("RootStore", {
  pollDraft: PollDraft,
  publishedPolls: PublishedPolls
})

export default RootStore
