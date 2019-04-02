import * as React from "react"
import { Box, Typography } from "@smooth-ui/core-sc"
import { observer } from "mobx-react-lite"
import useInject from "../hooks/useInject"
import { RootStoreModel } from "../stores/RootStore"
import PublishedPoll from "./PublishedPoll"

const mapStore = ({ publishedPolls }: RootStoreModel) => ({
  publishedPolls
})

const PublishedPolls: React.FunctionComponent<{}> = () => {
  const { publishedPolls } = useInject(mapStore)

  return (
    <Box display="flex" flexDirection="column">
      <Typography as="div" variant="h2" mb={20}>
        Published polls
      </Typography>
      {publishedPolls.polls.map(poll => (
        <PublishedPoll poll={poll} key={poll.id} />
      ))}
    </Box>
  )
}

export default observer(PublishedPolls)
