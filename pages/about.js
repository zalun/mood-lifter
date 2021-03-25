import { Container } from '@material-ui/core'
import { EXPRESSIONS } from '../helpers/expressions'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function About() {
  return (
    <Container maxWidth="lg">
      <Head>
        <title>Kveta</title>
        <link rel="icon" href="/favicon.ico" />
        <script defer src="/face-api.min.js"></script>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Kveta</h1>
        <p>
          Here we will write some words about the project - technology, authors, research, etc.
        </p>
      </main>
    </Container>
  )
}
