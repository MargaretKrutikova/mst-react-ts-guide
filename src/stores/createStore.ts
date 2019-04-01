import RootStore, { RootStoreModel, RootStoreEnv } from "./RootStore"
import { PollDraft } from "./PollDraft"
import { PublishedPolls } from "./PublishedPolls"

// could possibly accept some initial state
export const createStore = (): RootStoreModel => {
  const publishedPolls = PublishedPolls.create()
  const pollDraft = PollDraft.create()

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
