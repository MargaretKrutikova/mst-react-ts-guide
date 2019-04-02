import * as React from "react"
import { Grid, Col, Row, Typography, Normalize } from "@smooth-ui/core-sc"

import PollDraft from "./PollDraft"
import PublishedPolls from "./PublishedPolls"

const App: React.FunctionComponent<{}> = () => (
  <div className="App">
    <Normalize />
    <header className="App-header">
      <Typography variant="h1" as="div">
        Poll Maker
      </Typography>
    </header>
    <Grid as="main" maxWidth={1100} px={{ xs: 10, md: 30 }} mx="auto" pt={40}>
      <Row>
        <Col sm={12} md={5}>
          <PollDraft />
        </Col>
        <Col sm={0} md={2} />
        <Col sm={12} md={5}>
          <PublishedPolls />
        </Col>
      </Row>
    </Grid>
  </div>
)

export default App
