import { useState } from 'react'
import { Container } from '@material-ui/core'
import { EXPRESSIONS } from '../helpers/expressions'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Upload() {
  const [status, setStatus] = useState('')
  const handleUploadPhoto = async (e) => {
    e.preventDefault()

    const form = e.currentTarget
    const file = form.file.files[0]
    const filename = encodeURIComponent(file.name)

    // Presign the connection to S3
    const signedS3 = await fetch(`/api/sign_s3?file=${filename}`)
    const { url, fields } = await signedS3.json()
    const formData = new FormData()

    // Upload to S3
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value)
    })
    setStatus('Uploading file to S3 bucket')
    const upload = await fetch(url, {
      method: 'POST',
      body: formData
    })
    console.log(upload)
    if (upload.ok) {
      setStatus('Uploaded successfully!')
    } else {
      setStatus('Upload failed.')
      return
    }

    // Store it in database
    setStatus('Storing in dynamoDB')
    const storeFormData = new FormData(form)
    storeFormData.append('url', filename)
    storeFormData.delete('file')
    const storeData = Object.fromEntries(storeFormData.entries())
    const storeBody = { expressions: [] }
    Object.entries(storeData).forEach(([key, value]) => {
      if (key.indexOf('expressions[') >= 0) {
        storeBody.expressions.push(value)
      } else {
        storeBody[key] = value
      }
    })
    const store = await fetch('/api/store_picture', {
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(storeBody)
    })

    if (store.ok) {
      setStatus('Stored successfully!')
    } else {
      setStatus('Error storing data')
    }
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
        <p>{status}</p>
        <form onSubmit={handleUploadPhoto}>
          <p>Upload a .png or .jpg image (max 1MB).</p>
          <p>Choose an image...</p>
          <input name="file" type="file" accept="image/png, image/jpeg" />
          <p>... for an expression</p>
          {EXPRESSIONS.map((expression) => (
            <li key={expression}>
              <input
                type="checkbox"
                name={'expressions[' + expression + ']'}
                value={expression}
              />
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
