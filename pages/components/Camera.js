import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const THRESHOLD = 0.7

const startModels = async () => {
  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ])
}

const startVideo = (video) => {
  console.log('--- starting video')
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    .then(function (stream) {
      video.current.srcObject = stream
    })
    .catch(err => console.error(err))
}

const Camera = React.forwardRef((props, ref) => {
  const [isStarted, setStarted] = useState(false)
  const [expressions, setExpressions] = useState([])
  const width = props.width || 720
  const height = props.height || 560

  const detectMood = (evt) => {
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(
        evt.target,
        new faceapi.TinyFaceDetectorOptions()
      )
        .withFaceLandmarks()
        .withFaceExpressions()
      if (detections && detections.length) {
        const mood = Object.entries(detections[0].expressions).filter(
          expression => expression[1] > THRESHOLD)
        setExpressions(mood.map(e => e[0]))
      }
    }, 100)
  }
  useEffect(async () => {
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

  return (<>
    <p>current mood --&gt; {expressions && expressions.map(expression => <>{expression}</>)}</p>
    <video ref={ref} width={width} height={height} onPlay={detectMood} autoPlay muted></video>
  </>)
})

Camera.displayName = 'Camera'

Camera.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
}

export default Camera
