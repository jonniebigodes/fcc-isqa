import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main
  },
  submitButton: {
    marginTop: theme.spacing.unit * 3,
    color: theme.palette.common.white
  },
  cancelButton: {
    marginTop: theme.spacing.unit * 3,
    color: theme.palette.common.white,
    backgroundColor: '#af3205'
  },
  textThread: {
    color: theme.palette.primary.main,
    '&:hover': {
      cursor: 'pointer'
    }
  }
})

class ThreadCreator extends Component {
  state = {
    textofThread: '',
    threadPassword: '',
    threadVerifypassword: '',
    expanded: false,
    passwordsNOK: false
  }

  handleExpansion = () => {
    this.setState(prevstate => ({
      expanded: !prevstate.expanded,
      threadPassword: '',
      textofThread: '',
      threadVerifypassword: ''
    }))
  }

  handleTitleChange = e => {
    this.setState({textofThread: e.target.value})
  }

  handlePasswordChange = e => {
    this.setState({threadPassword: e.target.value})
  }

  handleVerifyChange = e => {
    this.setState({threadVerifypassword: e.target.value})
  }

  handleCloseSnack = () => {
    this.setState(prevstate => ({
      passwordsNOK: !prevstate.passwordsNOK
    }))
  }

  addNewThread = () => {
    const {threadPassword, threadVerifypassword, textofThread} = this.state
    const {add} = this.props
    if (threadVerifypassword.toLowerCase() === threadPassword.toLowerCase()) {
      add({deletepassword: threadPassword, threadText: textofThread})
      this.handleExpansion()
    } else {
      this.setState({passwordsNOK: true})
    }
  }

  render() {
    const {
      textofThread,
      threadPassword,
      threadVerifypassword,
      expanded,
      passwordsNOK
    } = this.state
    const {classes} = this.props
    if (!expanded) {
      return (
        <Typography
          align="center"
          variant="h4"
          gutterBottom
          onClick={this.handleExpansion}
          className={classes.textThread}>
          [Start a new Thread]
        </Typography>
      )
    }
    return (
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <form className={classes.form} onSubmit={e => e.preventDefault()}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="threadText">Title</InputLabel>
              <Input
                name="threadText"
                id="threadText"
                autoComplete="none"
                autoFocus
                value={textofThread}
                onChange={this.handleTitleChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="threadPassword">Delete password</InputLabel>
              <Input
                id="threadPassword"
                name="threadPassword"
                autoComplete="none"
                value={threadPassword}
                error={passwordsNOK}
                onChange={this.handlePasswordChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="threaddelpwd">
                Verify delete password
              </InputLabel>
              <Input
                id="threaddelpwd"
                name="threaddelpwd"
                autoComplete="none"
                value={threadVerifypassword}
                error={passwordsNOK}
                onChange={this.handleVerifyChange}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.addNewThread}
              className={classes.submitButton}
              disabled={textofThread === ''}>
              Create Thread
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.cancelButton}
              onClick={this.handleExpansion}>
              Cancel
            </Button>
          </form>
        </Paper>
      </div>
    )
  }
}
ThreadCreator.propTypes = {
  add: PropTypes.func,
  classes: PropTypes.shape({})
}
export default withStyles(styles)(ThreadCreator)
