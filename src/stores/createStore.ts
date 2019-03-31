import RootStore, { RootStoreModel } from "./RootStore"
import { PollDraft, PollDraftEnv } from "./PollDraft"
import { PublishedPolls } from "./PublishedPolls"

// could possibly accept some initial state
export const createStore = (): RootStoreModel => {
  const publishedPolls = PublishedPolls.create()

  const pollDraftEnv: PollDraftEnv = { publishedPolls }
  const pollDraft = PollDraft.create({}, pollDraftEnv)

  return RootStore.create({
    pollDraft,
    publishedPolls
  })
}
