const THRESHOLD = 0.5

exports.loadModels = async () => {
  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ])
}

exports.readExpression = async (videoRef) => {
  const response = { all: null, chosen: null }
  const detections = await faceapi.detectAllFaces(
    videoRef.current,
    new faceapi.TinyFaceDetectorOptions()
  )
    .withFaceLandmarks()
    .withFaceExpressions()
  if (detections && detections.length > 0) {
    // set expressions state
    response.all = Object.entries(detections[0].expressions).map(exp => { return { name: exp[0], score: exp[1] } })
    response.chosen = response.all.filter(exp => exp.score > THRESHOLD).map(exp => exp.name).pop()
  }
  return response
}
