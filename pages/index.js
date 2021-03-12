import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Mood Lifter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Mood Lifter
        </h1>

        <p className={styles.description}>
          We will lift your mood in a second! (or two)
        </p>

       
      </main>

      <footer className={styles.footer}>
        Powered by{' '}
          Love
      </footer>
    </div>
  )
}
