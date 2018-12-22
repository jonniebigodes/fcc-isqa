import React, {Component} from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import {withStyles} from '@material-ui/core/styles'
import {Button} from '@material-ui/core'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    width: '100',
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 6,
    marginLeft: theme.spacing.unit
  },
  textfield: {
    background: 'transparent',
    [theme.breakpoints.down('xs')]: {
      width: 40
    },
    [theme.breakpoints.down('sm')]: {
      width: 180
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: 200
    },
    [theme.breakpoints.up('md')]: {
      width: 450
    }
  }
})

class ProjectCreator extends Component {
  state = {
    projectName: ''
  }

  onchangeProject = e => {
    this.setState({projectName: e.target.value})
  }

  addProject = () => {
    const {projectCreate} = this.props
    const {projectName} = this.state
    projectCreate(projectName)
  }

  render() {
    const {projectName} = this.state
    const {classes} = this.props
    return (
      <div className={classes.container}>
        <form className={classes.form} onSubmit={e => e.preventDefault()}>
          <FormControl margin="normal" required>
            <InputLabel htmlFor="project">Add a Project</InputLabel>
            <Input
              id="project"
              name="project"
              value={projectName}
              onChange={this.onchangeProject}
              inputProps={{
                'aria-label': 'Add project'
              }}
              className={classes.textfield}
              autoFocus
              autoComplete="nope"
            />
          </FormControl>
        </form>
        <Button
          type="submit"
          variant="raised"
          className={classes.submit}
          color="primary"
          disabled={projectName === ''}
          onClick={this.addProject}>
          Add
        </Button>
      </div>
    )
  }
}
ProjectCreator.propTypes = {
  classes: PropTypes.shape({}),
  projectCreate: PropTypes.func
}
export default withStyles(styles)(ProjectCreator)
