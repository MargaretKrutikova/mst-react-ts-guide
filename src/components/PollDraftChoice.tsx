import * as React from "react"
import { Input, Box, Button } from "@smooth-ui/core-sc"
import { PollDraftChoiceModel } from "../stores/PollDraft"
import { observer } from "mobx-react-lite"

type Props = {
  choice: PollDraftChoiceModel
}

const PollOptionView: React.FunctionComponent<Props> = ({ choice }) => {
  const handleValueChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      choice.setChoice(e.target.value)
    },
    [choice]
  )
  const handleRemove = () => choice.remove()

  return (
    <Box display="flex" alignItems="center" mb={10}>
      <Input
        mr={10}
        flex={1}
        value={choice.value}
        onChange={handleValueChange}
        placeholder="Enter choice"
      />
      <Button variant="light" onClick={handleRemove}>
        ❌
      </Button>
    </Box>
  )
}

export default observer(PollOptionView)
