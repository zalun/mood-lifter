import { Container } from '@material-ui/core'
import { EXPRESSIONS } from '../helpers/expressions'
import Head from 'next/head'
import styles from '../styles/Home.module.css'


export default function Upload () {
  const uploadPhoto = async (e) => {
		e.preventDefault()
		console.log(e.target)
		const formData = new FormData(e.target)
    // const file = e.target.files[0]
    // const filename = encodeURIComponent(file.name)
    const res = await fetch(
			`/api/upload-image`, {
				method: 'POST',
				body: new URLSearchParams([...formData]),
			}
		)
		const { success } = await res.json()

    if (success) {
      console.log('Uploaded successfully!')
    } else {
      console.error('Upload failed.')
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
				<form onSubmit={uploadPhoto}>
				<p>Upload a .png or .jpg image (max 1MB).</p>
					<p>Choose an image...</p>
					<input
						name="file"
						type="file"
						accept="image/png, image/jpeg"
					/>
					<p>... for an expression</p>
					{EXPRESSIONS.map((expression) => <li key={expression}><input type='radio' name='expression' value={expression}/>{expression}</li>)}
					<p><input type="submit" value="Submit"/></p>
				</form>
			</main>
    </Container>
  )
}
