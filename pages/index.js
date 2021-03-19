import React, { Component, createRef } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import CollectExpression from '../components/CollectExpression'

class Home extends Component {
  state = {
    status: '',
    currentDetectionName: 'initial',
    expressions: {},
    result: 'We will lift your mood in a second! (or two)'
  }

  constructor (props) {
    super(props)
    this.expressionsRef = createRef()
    this.handleExpressions = this.handleExpressions.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
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
          this.setState({ result: 'Expressions collected.'})
          console.log(this.state.expressions)
      }
    })
  }

  handleStatusChange (status) {
    this.setState({ status })
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
        </main>

        <footer className={styles.footer}>
          Powered by Love | {this.state.currentDetectionName} &gt; {this.state.status}
        </footer>
      </div>
    )
  }
}

export default Home
