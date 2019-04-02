import * as React from "react"
import { Box, Button, Typography } from "@smooth-ui/core-sc"
import { observer } from "mobx-react-lite"
import { PublishedPollModel } from "../stores/PublishedPolls"

type Props = {
  poll: PublishedPollModel
}

const PublishedPoll: React.FunctionComponent<Props> = ({ poll }) => {
  const handleRemove = () => poll.remove()

  return (
    <Box borderBottom="1px solid #ccc" py={10}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={10}
      >
        <Typography variant="h4">{poll.question}</Typography>
        <Button variant="light" onClick={handleRemove}>
          ❌
        </Button>
      </Box>

      <Box
        as="ul"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
        {poll.choices.map((choice, index) => (
          <Typography key={index} variant="h5" as="li">
            ✔️
            <Box as="span" ml={10}>
              {choice.value}
            </Box>
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

export default observer(PublishedPoll)
