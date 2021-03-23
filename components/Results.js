import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Fab, Modal } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const THRESHOLD = 0.3

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
    width: '400px',
    maxWidth: '80%',
    maxHeight: '80%',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'auto',
    textAlign: 'left'
  }
}

const calculateResults = (expressions) => {
  const reactions = ['initial', 'first-reaction', 'second-reaction']
  const results = []
  reactions.forEach(reactionName => {
    const reaction = { name: reactionName, expressions: [] }
    expressions[reactionName].forEach(expression => {
      if (expression.score > THRESHOLD) {
        reaction.expressions.push({ name: expression.name, score: Math.round(expression.score * 100) })
      }
    })
    results.push(reaction)
  })
	return results
}

const Results = (props) => {
  const [reactions, setReactions] = useState([])
	const [expressions, setExpressions] = useState([])

  useEffect(() => {
		if (props.expressions === expressions) {
			return
		}
		setExpressions(props.expressions)
    if (props.expressions['second-reaction']) {
      setReactions(calculateResults(props.expressions))
    }
  })
  return <Modal
		open={props.visible}
		aria-labelledby="simple-modal-title"
		aria-describedby="simple-modal-description"
		style={{ alignItems: 'center', justifyContent: 'center' }}
	>
		<div style={getModalStyle()} className={props.classes.paper}>
			<h3>Results</h3>
			{reactions.length
			  ? reactions.map(reaction => <div key={reaction.name}>
				<p key={reaction.name}>
					<b>{reaction.name}</b>:&nbsp;
					{reaction.expressions.map(expression => {
				  	return <>{expression.name}: {expression.score}%</>
					})}
				</p>
			</div>)
			  : ''}
			<Fab
        color='secondary'
        variant='extended'
        size='large'
        onClick={props.handleRestart}
        >Again</Fab>
		&nbsp;
		<Fab
        color='primary'
        variant='extended'
        size='large'
        href="/about"
        >About</Fab>
		</div>
	</Modal>
}

Results.propTypes = {
  visible: PropTypes.bool,
	expressions: PropTypes.object,
	handleRestart: PropTypes.func,
  classes: PropTypes.object.isRequired // withStyles
}

export default withStyles(styles)(Results)
