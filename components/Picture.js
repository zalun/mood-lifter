// Display a picture based on expressions
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'

const Picture = forwardRef((props, ref) => {
  useEffect(() => {
    console.log('picture', props.visible)
  })
  return <>{props.visible ? <img ref={ref} src={props.url}/> : ''}</>
})

Picture.displayName = 'Picture'
Picture.propTypes = {
  visible: PropTypes.bool,
  url: PropTypes.string
}

export default Picture
