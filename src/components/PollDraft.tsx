import * as React from "react"
import { observer } from "mobx-react-lite"

import { RootStoreModel } from "../stores/RootStore"
import useInject from "../hooks/useInject"
import { Input, Button, Box, Typography } from "@smooth-ui/core-sc"
import PollDraftChoice from "./PollDraftChoice"

const mapStore = ({ pollDraft }: RootStoreModel) => ({
  pollDraft
})

const PollDraft: React.FunctionComponent<{}> = observer(() => {
  const { pollDraft } = useInject(mapStore)

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    pollDraft.setQuestion(e.target.value)

  const publishDraft = () => pollDraft.publish()
  const addChoice = () => pollDraft.addChoice("")

  return (
    <Box display="flex" flexDirection="column">
      <Typography as="div" variant="h2" mb={20}>
        Create a new poll
      </Typography>
      <Input
        value={pollDraft.question}
        onChange={handleQuestionChange}
        placeholder="Enter poll question"
        mb={20}
      />

      <Typography variant="h3" as="div">
        Choices
      </Typography>
      {pollDraft.choices.map((choice, index) => (
        <PollDraftChoice choice={choice} key={index} />
      ))}

      <Box display="flex" justifyContent="flex-end">
        <Button onClick={publishDraft} alignSelf="center" mr={10}>
          Publish
        </Button>
        <Button onClick={addChoice} variant="info" alignSelf="center">
          Add choice
        </Button>
      </Box>
    </Box>
  )
})

export default PollDraft
