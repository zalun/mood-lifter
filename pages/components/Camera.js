import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'


const startVideo = (video) => {
	navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
	.then( stream => video.srcObject = stream )
	.catch(err => console.error(err))
}
const Camera = (props) => {
	const videoRef = useRef()
	const [ started, setStarted ] = useState(false)
	const width = props.width || 720
	const height = props.height || 560
	useEffect(() => {
		if (!started) {
			startVideo(videoRef.current)
		}
	})
	return <video ref={videoRef} width={width} height={height} autoPlay muted></video>
}

Camera.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number
}

export default Camera