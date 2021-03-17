// Create a video and recognize mood
import React, { useEffect, useState } from 'react'
import { useStore } from 'react-context-hook'
import PropTypes from 'prop-types'

// global: faceapi

// How confident about expressions should be the network to consider it
const THRESHOLD = 0.5

let isExpressionDetected = null
let detectionId = null

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
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    .then(function (stream) {
      video.srcObject = stream
    })
    .catch(err => console.error(err))
}

const Camera = React.forwardRef((props, videoRef) => {
  // Prevent from starting the face recognition multiple times
  const [isStarted, setStarted] = useState(false)
  // Hold the recognized expressions in a state
  const [expression, setExpression] = useState('')
  const [expressions, setExpressions] = useState([])
  // Status is placed in global store
  const [status, setStatus] = useStore('status')

  // width and height of the video output 
  const width = props.width || 240
  const height = props.height || 160

  const readExpression = async () => {
    const detections = await faceapi.detectAllFaces(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    )
      .withFaceLandmarks()
      .withFaceExpressions()
    if (detections && detections.length) {
      // set expressions state
      const all = Object.entries(detections[0].expressions).map(exp => { return { name: exp[0], score: exp[1] } })
      const chosen = all.filter(exp => exp.score > THRESHOLD).map(exp => exp.name).pop()
      isExpressionDetected = chosen
      setExpression(chosen)
      setExpressions(all)
    }
  } 
  const detectMood = () => {
    setStatus('detecting face expression...')
    // Check the expression every some ms
    isExpressionDetected = null
    detectionId = setInterval(readExpression, 200)
    console.log('created new interval', detectionId)
  }
  
  useEffect(async () => {
    console.log('state changed or something', isExpressionDetected)
    // Load components only once.
    if (!isStarted) {
      setTimeout(async () => {
        setStarted(true)
        videoRef.current.addEventListener('play', detectMood)
        setStatus('loading face-api models...')
        await startModels()
        setStatus('starting video...')
        startVideo(videoRef.current)
      }, 300)
    }
    if (isExpressionDetected) {
      isExpressionDetected = false
      clearInterval(detectionId)
      setStatus('Detecting expression stopped. Next in 5 seconds')
      console.log('cleared interval', detectionId)
      setTimeout(detectMood, 5000)
    }
  })



  // Render the video (the paragraph is just for the presentation while development)
  return (<>
    <p>{expression}</p>
    <video ref={videoRef} width={width} height={height} autoPlay muted></video>
    <p>{expressions && expressions.map(exp => {
      return <span key={exp.name}>{exp.name}: {Math.round(exp.score * 100)}% </span>
    })}</p>

  </>)
})

Camera.displayName = 'Camera'

Camera.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
}

export default Camera
