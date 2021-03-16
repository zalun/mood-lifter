// Create a video and recognize mood
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

// global: faceapi

// How confident about expressions should be the network to consider it
const THRESHOLD = 0.6

const startModels = async () => {
  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ])
}

const startVideo = (video) => {
  // Connect camera to the video output
  // TODO: specify the camera resolution
  console.log('---> starting video')
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    .then(function (stream) {
      video.current.srcObject = stream
    })
    .catch(err => console.error(err))
}

const Camera = React.forwardRef((props, ref) => {
  // Prevent from starting the face recognition multiple times
  const [isStarted, setStarted] = useState(false)
  // Hold the recognized expressions in a state
  const [expressions, setExpressions] = useState([])
  // width and height of the video output
  const width = props.width || 240
  const height = props.height || 160

  const detectMood = (evt) => {
    setInterval(async () => {
      // Check the expression every 100 ms
      const detections = await faceapi.detectAllFaces(
        evt.target,
        new faceapi.TinyFaceDetectorOptions()
      )
        .withFaceLandmarks()
        .withFaceExpressions()
      if (detections && detections.length) {
        // set expressions state
        setExpressions(detections[0].expressions)
      }
    }, 100)
  }
  useEffect(async () => {
    // Call this function after the component is mounted.
    if (!isStarted) {
      setTimeout(async () => {
        console.log('--- loading face-api models')
        await startModels()
        console.log('--- models loaded')
        startVideo(ref)
        setStarted(true)
      }, 300)
    }
  })

	const all = Object.entries(expressions)
	const chosen = all.filter(expression => expression[1] > THRESHOLD).map(expression => expression[0])

  // Render the video (the paragraph is just for the presentation while development)
  return (<>
    <p>{chosen && chosen.map(expression => <>{expression}</>)}</p>
    <video ref={ref} width={width} height={height} onPlay={detectMood} autoPlay muted></video>
		<p>{all && all.map(expression => {
		  return <>{expression[0]}: {Math.round(expression[1] * 100)}% </>
		})}</p>

  </>)
})

Camera.displayName = 'Camera'

Camera.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
}

export default Camera
