import React, { useRef } from 'react'
import { useStore } from 'react-context-hook'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Camera from './components/Camera'

export default function Home () {
  const videoRef = useRef()
  const [status] = useStore('status', 'initializing...')
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
        <Camera ref={videoRef} />
        <p className={styles.description}>
          We will lift your mood in a second! (or two)
        </p>
      </main>

      <footer className={styles.footer}>
        Powered by Love{status ? `| ${status}` : ''}
      </footer>
    </div>
  )
}
