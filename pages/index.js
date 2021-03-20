import React, { Component, createRef } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import CollectExpression from '../components/CollectExpression'

const initialStatus = {
  json: '',
  status: '',
  currentDetectionName: 'initial',
  expressions: {},
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
          // TODO show a picture with first reactions
          setTimeout(() => {
            this.setState({ currentDetectionName: 'first-reaction' })
          }, 2000)
          break
        case 'first-reaction':
          setTimeout(() => {
            this.setState({ currentDetectionName: 'second-reaction' })
          }, 10000)
          break
        case 'second-reaction':
          this.setState({
            result: 'Expressions collected.',
            results: JSON.stringify(this.state.expressions, null, 2)
          })
          console.log(this.state.expressions)
      }
    })
  }

  handleStatusChange (status) {
    this.setState({ status })
  }

  handleRestart () {
    this.setState(initialStatus)
  }

  render () {
    return (
      <div className={styles.container}>
        <Head>
          <title>Mood Lifter</title>
          <link rel="icon" href="/favicon.ico" />
          <script defer src="/face-api.min.js"></script>
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Mood Lifter
          </h1>
          <CollectExpression
            detectionName={this.state.currentDetectionName}
            setStatus={this.handleStatusChange}
            onExpressions={this.handleExpressions}
            ref={this.expressionsRef}
          />
          <p className={styles.description}>
            {this.state.result}
          </p>
          {this.state.expressions['second-reaction'] ? <button onClick={this.handleRestart}>AGAIN!</button> : ''}
          <pre className={styles.json}><code>{this.state.results}</code></pre>
        </main>

        <footer className={styles.footer}>
          Powered by Love | {this.state.currentDetectionName} &gt; {this.state.status}
        </footer>
      </div>
    )
  }
}

export default Home
