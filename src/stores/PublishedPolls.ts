import { types, Instance, destroy, getParent, cast } from "mobx-state-tree"
import { PollBase } from "./PollBase"
import { PollDraftModel } from "./PollDraft"
import shortid from "shortid"

type PublishedPollModel = Instance<typeof PublishedPoll>
export type PublishedPollsModel = Instance<typeof PublishedPolls>

const PublishedPoll = types
  .compose(
    PollBase,
    types.model({
      id: types.identifier
    })
  )
  .actions(self => ({
    remove() {
      const parent = getParent<PublishedPollsModel>(self, 2)
      parent.removePoll(cast(self))
    }
  }))

export const PublishedPolls = types
  .model({
    polls: types.optional(types.array(PublishedPoll), [])
  })
  .actions(self => ({
    publishDraft(pollDraft: PollDraftModel) {
      const pollToPublish = { ...pollDraft, id: shortid() }
      self.polls.push(pollToPublish)
    },
    removePoll(poll: PublishedPollModel) {
      destroy(poll)
    }
  }))
