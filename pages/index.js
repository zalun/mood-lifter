import React, { Component, createRef } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import CollectExpression from '../components/CollectExpression'

class Home extends Component {
  state = {
    status: ''
  }

  constructor (props) {
    super(props)
    this.expressionsRef = createRef()
    this.handleExpressions = this.handleExpressions.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
  }

  handleExpressions (expressions) {
    console.log('Received expressions', expressions)
    console.log('expressionsRef', this.expressionsRef.current)
    setTimeout(this.expressionsRef.current.detectExpression, 5000)
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
          <CollectExpression setStatus={ this.handleStatusChange } onExpressions={ this.handleExpressions } ref={ this.expressionsRef } />
          <p className={styles.description}>
            We will lift your mood in a second! (or two)
          </p>
        </main>

        <footer className={styles.footer}>
          Powered by Love{this.state.status ? ` | ${this.state.status}` : ''}
        </footer>
      </div>
    )
  }
}

export default Home
