import React, { Component, createRef } from 'react'
import { Container } from '@material-ui/core'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import CollectExpression from '../components/CollectExpression'
import Picture from '../components/Picture'

const initialStatus = {
  json: '',
  status: '',
  currentDetectionName: 'initial',
  expressions: {},
  isPictureVisible: false,
  pictureUrl: '/art/bunnies/happy.jpg',
  result: 'We will lift your mood in a second! (or two)'
}
class Home extends Component {
  state = initialStatus

  constructor (props) {
    super(props)
    this.expressionsRef = createRef()
    this.handleExpressions = this.handleExpressions.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleRestart = this.handleRestart.bind(this)
    this.closePicture = this.closePicture.bind(this)
  }

  handleExpressions (expressions) {
    this.setState({
      expressions: {
        ...this.state.expressions,
        [this.state.currentDetectionName]: expressions
      }
    })
    setTimeout(() => {
      switch (this.state.currentDetectionName) {
        case 'initial':
          console.log(this.state.expressions)
          // TODO show a picture with first reactions
          this.setState({ isPictureVisible: true })
          setTimeout(() => {
            this.setState({ currentDetectionName: 'first-reaction' })
          }, 2000)
          break
        case 'first-reaction':
          console.log(this.state.expressions)
          setTimeout(() => {
            this.setState({ currentDetectionName: 'second-reaction' })
          }, 8000)
          break
        case 'second-reaction':
          this.setState({
            result: 'Expressions collected.'
          })
          console.log(this.state.expressions)
      }
    })
  }

  handleStatusChange (status) {
    this.setState({ status })
  }

  closePicture () {
    this.setState({ isPictureVisible: false })
  }

  handleRestart () {
    setTimeout(() => { this.setState(initialStatus) }, 1000)
  }

  render () {
    return (
      <Container maxWidth="lg">
        <Head>
          <title>Mood Lifter</title>
          <link rel="icon" href="/favicon.ico" />
          <script defer src="/face-api.min.js"></script>
        </Head>

        <Picture
          ref={this.pictureRef}
          visible={this.state.isPictureVisible}
          buttonVisible={!!this.state.expressions['second-reaction']}
          handleRestart={this.handleRestart}
          url={this.state.pictureUrl}
        />
        <main className={styles.main}>
          <h1 className={styles.title}>
            Mood Lifter
          </h1>

          <p className={styles.description}>
            {this.state.result}
          </p>
          <CollectExpression
            detectionName={this.state.currentDetectionName}
            setStatus={this.handleStatusChange}
            onExpressions={this.handleExpressions}
            ref={this.expressionsRef}
          />
        </main>

        <footer className={styles.footer}>
          Powered by Love | {this.state.currentDetectionName} &gt; {this.state.status}
        </footer>
      </Container>
    )
  }
}

export default Home
