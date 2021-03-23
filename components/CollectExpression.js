// Create a video and recognize mood
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { loadModels, readExpression } from '../helpers/expressions'

// global: faceapi

// How confident about expressions should be the network to consider it a choice

let isExpressionDetected = null

const startVideo = (video) => {
  // Connect camera to the video output
  // TODO: specify the camera resolution
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: 'user' }, audio: false })
    .then(function (stream) {
      video.srcObject = stream
    })
    .catch((err) => console.error(err))
}

const CollectExpression = forwardRef((props, ref) => {
  const videoRef = useRef()
  // Prevent from starting the face recognition multiple times
  const [isStarted, setStarted] = useState(false)
  // Current name of detection
  const [currentDetectionName, setCurrentDetectionName] = useState('')
  // Hold the recognized expressions in a state
  const [expressions, setExpressions] = useState([])
  // Store the detection interval id in the state to clear it later
  const [detectionInterval, setDetectionInterval] = useState(null)

  // width and height of the video output
  const width = props.width || 240
  const height = props.height || 160

  const detectMood = () => {
    props.setStatus('detecting face expression...')
    // Check the expression every some ms
    isExpressionDetected = null
    const detectionId = setInterval(async () => {
      if (isExpressionDetected) {
        return
      }
      const response = await readExpression(videoRef)
      if (response.chosen) {
        setExpressions(response.all)
        isExpressionDetected = response.chosen
      }
    }, 200)
    setDetectionInterval(detectionId)
    console.log('created new interval', detectionId)
  }

  useImperativeHandle(ref, () => ({
    detectExpression: detectMood
  }))

  useEffect(async () => {
    // Load components only once.
    if (!isStarted) {
      setTimeout(async () => {
        setStarted(true)
        videoRef.current.addEventListener('play', detectMood)
        props.setStatus('loading face-api models...')
        await loadModels()
        props.setStatus('starting video...')
        startVideo(videoRef.current)
      }, 400)
    }
    if (isExpressionDetected && detectionInterval) {
      isExpressionDetected = false
      clearInterval(detectionInterval)
      setDetectionInterval(0)
      props.setStatus('expressions received')
      props.onExpressions(expressions, props.detectionName)
    }
    if (videoRef.current && currentDetectionName !== props.detectionName) {
      detectMood()
      setCurrentDetectionName(props.detectionName)
    }
  })

  // Render the video (the paragraph is just for the presentation while development)
  return (
    <>
      <video ref={videoRef} width={width} height={height} autoPlay muted></video>
    </>
  )
})

CollectExpression.displayName = 'CollectExpression'

CollectExpression.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  onExpressions: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  detectionName: PropTypes.string.isRequired
}

export default CollectExpression
