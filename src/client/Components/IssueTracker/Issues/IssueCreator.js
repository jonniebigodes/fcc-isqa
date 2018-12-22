import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ReportIcon from '@material-ui/icons/ReportOutlined'

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
  submit: {
    marginTop: theme.spacing.unit * 3
  }
})

class IssueCreator extends Component {
  state = {
    issueTitle: '',
    issueText: '',
    creator: '',
    assigned: '',
    statustext: ''
  }

  onChangeAssigned = e => {
    this.setState({assigned: e.target.value})
  }

  onChangeStatus = e => {
    this.setState({statustext: e.target.value})
  }

  onChangeCreator = e => {
    this.setState({creator: e.target.value})
  }

  onChangeTitle = e => {
    this.setState({issueTitle: e.target.value})
  }

  onChangeIssueText = e => {
    this.setState({issueText: e.target.value})
  }

  createIssue = () => {
    const {issueTitle, issueText, creator, assigned, statustext} = this.state
    const {createIssue} = this.props
    createIssue({
      titleofissue: issueTitle,
      textofissue: issueText,
      issuecreator: creator,
      issueassigned: assigned === '' ? undefined : assigned,
      issuestatus: statustext === '' ? undefined : statustext
    })
  }

  discardIssue = () => {
    this.setState({
      issueTitle: '',
      issueText: '',
      creator: '',
      assigned: '',
      statustext: ''
    })
  }

  render() {
    const {issueTitle, issueText, creator, assigned, statustext} = this.state
    const {classes, project} = this.props
    return (
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <ReportIcon />
          </Avatar>
          <Typography variant="subheading" align="center" gutterBottom>
            Create issue for project {project}
          </Typography>
          <form className={classes.form} onSubmit={e => e.preventDefault()}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="title">Issue Title</InputLabel>
              <Input
                id="title"
                name="title"
                autoComplete="none"
                autoFocus
                value={issueTitle}
                onChange={this.onChangeTitle}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="issuetext">Issue Text</InputLabel>
              <Input
                name="issuetext"
                id="issuetext"
                autoComplete="none"
                value={issueText}
                onChange={this.onChangeIssueText}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="creator">Issue Creator</InputLabel>
              <Input
                name="creator"
                id="creator"
                autoComplete="none"
                value={creator}
                onChange={this.onChangeCreator}
              />
            </FormControl>
            {creator && (
              <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="assigned">Issue assigned</InputLabel>
                <Input
                  name="assigned"
                  id="assigned"
                  autoComplete="none"
                  value={assigned}
                  onChange={this.onChangeAssigned}
                />
              </FormControl>
            )}

            {assigned && (
              <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="statustext">Issue status text</InputLabel>
                <Input
                  name="statustext"
                  id="statustext"
                  autoComplete="none"
                  value={statustext}
                  onChange={this.onChangeStatus}
                />
              </FormControl>
            )}
            <Button
              type="submit"
              fullWidth
              variant="raised"
              color="primary"
              onClick={this.createIssue}
              className={classes.submit}
              disabled={issueTitle === ''}>
              Submit Issue
            </Button>
          </form>
        </Paper>
      </div>
    )
  }
}
IssueCreator.propTypes = {
  classes: PropTypes.shape({}),
  createIssue: PropTypes.func,
  project: PropTypes.string
}
export default withStyles(styles)(IssueCreator)
