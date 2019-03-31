import { types, Instance } from "mobx-state-tree"
import { PollDraft } from "./PollDraft"
import { PublishedPolls } from "./PublishedPolls"

export type RootStoreModel = Instance<typeof RootStore>

const RootStore = types.model("RootStore", {
  pollDraft: PollDraft,
  publishedPolls: PublishedPolls
})

export default RootStore
