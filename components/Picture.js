// Display a picture based on expressions
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Fab, Modal } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing(50),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4)
  }
})

function getModalStyle () {
  return {
    width: '1074px',
    maxWidth: '100%',
    maxHeight: '100%',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'auto',
    textAlign: 'center'
  }
}

const Picture = forwardRef((props, ref) => {
  const { classes } = props

  return <>
  <Modal
    open={props.visible}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    style={{ alignItems: 'center', justifyContent: 'center' }}

  ><div style={getModalStyle()} className={classes.paper}>
    <img width='100%' ref={ref} src={props.url}/>
    <p>Please stay with us...</p>
  </div></Modal>
  <Modal
    open={props.buttonVisible}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    style={{ alignItems: 'center', justifyContent: 'center' }}

  ><div style={getModalStyle()} className={classes.paper}>
    <Fab
        color='primary'
        variant='extended'
        size='large'
        onClick={props.handleRestart}
        >Thank you. Would you like to do it again?
    </Fab>
  </div></Modal>
  </>
})

Picture.displayName = 'Picture'
Picture.propTypes = {
  visible: PropTypes.bool.isRequired,
  buttonVisible: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  handleRestart: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired // withStyles
}

const PictureWrapped = withStyles(styles)(Picture)
export default PictureWrapped
