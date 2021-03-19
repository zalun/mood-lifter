// Create a video and recognize mood
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useStore } from 'react-context-hook'
import PropTypes from 'prop-types'

// global: faceapi

// How confident about expressions should be the network to consider it a choice
const THRESHOLD = 0.5

let isExpressionDetected = null

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

function CollectExpression(props, ref) {
  const videoRef = useRef()
  // Prevent from starting the face recognition multiple times
  const [isStarted, setStarted] = useState(false)
  // Hold the recognized expressions in a state
  const [expressions, setExpressions] = useState([])
  const [detectionInterval, setDetectionInterval] = useState(null)
  // Status is placed in global store
  const [_, setStatus] = useStore('status')

  // width and height of the video output 
  const width = props.width || 240
  const height = props.height || 160

  const readExpression = async () => {
    if (isExpressionDetected) {
      return
    }
    const detections = await faceapi.detectAllFaces(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    )
      .withFaceLandmarks()
      .withFaceExpressions()
    if (detections && detections.length > 0) {
      // set expressions state
      const all = Object.entries(detections[0].expressions).map(exp => { return { name: exp[0], score: exp[1] } })
      const chosen = all.filter(exp => exp.score > THRESHOLD).map(exp => exp.name).pop()
      if (all.length > 0) {
        isExpressionDetected = chosen
        setExpressions(all)
      }
    }
  } 
  const detectMood = () => {
    if (detectionInterval) {
      return
    }
    setStatus('detecting face expression...')
    // Check the expression every some ms
    isExpressionDetected = null
    const detectionId = setInterval(readExpression, 200)
    setDetectionInterval(detectionId)
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
      }, 400)
    }
    if (isExpressionDetected && detectionInterval) {
      isExpressionDetected = false
      clearInterval(detectionInterval)
      setDetectionInterval(null)
      setStatus('Expression received')
      props.onExpressions(expressions)
    }
  })



  // Render the video (the paragraph is just for the presentation while development)
  return (<>
    <video ref={videoRef} width={width} height={height} autoPlay muted></video>
    <p>{expressions && expressions.map(exp => {
      return <span key={exp.name}>{exp.name}: {Math.round(exp.score * 100)}% </span>
    })}</p>

  </>)
}

CollectExpression = forwardRef(CollectExpression)
CollectExpression.displayName = 'CollectExpression'

CollectExpression.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  onExpressions: PropTypes.func.isRequired
}

export default CollectExpression
