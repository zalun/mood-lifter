import { Container } from '@material-ui/core'
import { EXPRESSIONS } from '../helpers/expressions'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Upload() {
  const uploadPhoto = async (e) => {
    e.preventDefault()

    const file = e.target.file.files[0]
    const filename = encodeURIComponent(file.name)
    console.log(filename)
    // sign the connection to S3
    const signedS3 = await fetch(`/api/sign_s3?file=${filename}`)
    const { url, fields } = await signedS3.json()
    const formData = new FormData()

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const upload = await fetch(url, {
      method: 'POST',
      body: formData
    })

    if (upload.ok) {
      console.log('Uploaded successfully!')
    } else {
      console.error('Upload failed.')
    }

    // Store it in database
  }

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Mood Lifter</title>
        <link rel="icon" href="/favicon.ico" />
        <script defer src="/face-api.min.js"></script>
      </Head>
      <main className={styles.main}>
        <h1>Upload files</h1>
        <form onSubmit={uploadPhoto}>
          <p>Upload a .png or .jpg image (max 1MB).</p>
          <p>Choose an image...</p>
          <input name="file" type="file" accept="image/png, image/jpeg" />
          <p>... for an expression</p>
          {EXPRESSIONS.map((expression) => (
            <li key={expression}>
              <input type="radio" name="expression" value={expression} />
              {expression}
            </li>
          ))}
          <p>
            <input type="submit" value="Submit" />
          </p>
        </form>
      </main>
    </Container>
  )
}
