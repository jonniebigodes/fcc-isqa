import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Edit from '@material-ui/icons/EditOutlined'
import IssueEditorTitle from './IssueEditorTitle'
import IssueEditorText from './IssueEditorText'
import IssueEditorCreator from './IssueEditorCreator'
import IssueEditorAssigned from './IssueEditorAssigned'
import IssueEditorStatus from './IssueEditorStatus'

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
  avatarCollapsed: {
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
  }
})
class IssueEditor extends Component {
  state = {
    /* eslint-disable */
    issueTitle: this.props.issue.issuetitle,
    issueText: this.props.issue.text,
    creator: this.props.issue.creator,
    assigned: this.props.issue.assigned,
    statustext: this.props.issue.status
    /* eslint-enable */
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

  onEditIssue = () => {
    const {issueTitle, issueText, creator, assigned, statustext} = this.state
    const {editIssue, issue} = this.props
    editIssue({
      titleofissue:
        issueTitle !== issue.issuetitle ? issueTitle : issue.issuetitle,
      textofissue: issueText !== issue.text ? issueText : issue.text,
      issuecreator: creator !== issue.creator ? creator : issue.creator,
      issueassigned: assigned !== issue.assigned ? assigned : issue.assigned,
      issuestatus: statustext !== issue.status ? statustext : issue.status
    })
  }

  onCancelEdit = () => {
    const {cancelEdit} = this.props
    cancelEdit('')
  }

  showAdd = () => {
    this.setState(prevstate => ({
      isExpanded: !prevstate.isExpanded
    }))
  }

  render() {
    const {issueTitle, issueText, creator, assigned, statustext} = this.state
    const {classes, issue} = this.props

    return (
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar} onClick={this.showAdd}>
            <Edit />
          </Avatar>
          <Typography variant="h5">
            Edit issue for project {issue.projectName}
          </Typography>
          <form className={classes.form} onSubmit={e => e.preventDefault()}>
            <IssueEditorTitle
              title={issueTitle}
              changeTitle={this.onChangeTitle}
            />
            <IssueEditorText
              textissue={issueText}
              changeIssueText={this.onChangeIssueText}
            />
            <IssueEditorCreator
              creatorissue={creator}
              changeCreator={this.onChangeCreator}
            />
            <IssueEditorAssigned
              assignedto={assigned}
              changeAssigned={this.onChangeAssigned}
            />
            <IssueEditorStatus
              issuestatustext={statustext}
              changeStatus={this.onChangeStatus}
            />
            <Button
              type="submit"
              fullWidth
              variant="raised"
              color="primary"
              onClick={this.onEditIssue}
              className={classes.submitButton}
              disabled={issueTitle === ''}>
              Edit Issue
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="raised"
              onClick={this.onCancelEdit}
              className={classes.cancelButton}>
              Cancel
            </Button>
          </form>
        </Paper>
      </div>
    )
  }
}
IssueEditor.propTypes = {
  classes: PropTypes.shape({}),
  issue: PropTypes.shape({
    projectName: PropTypes.string,
    _id: PropTypes.string,
    issuetitle: PropTypes.string,
    text: PropTypes.string,
    creator: PropTypes.string,
    assigned: PropTypes.string,
    status: PropTypes.string
  }),

  editIssue: PropTypes.func,
  cancelEdit: PropTypes.func
}
export default withStyles(styles)(IssueEditor)
