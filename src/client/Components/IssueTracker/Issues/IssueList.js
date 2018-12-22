import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import IssueCreator from './IssueCreator'
import Issues from './Issues'
import {IssuesContext} from '../../../contexts/IssuesContext'

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },

  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  }
})
const IssueList = props => {
  const {classes} = props
  return (
    <IssuesContext.Consumer>
      {({
        projectInfo,
        issueInject,
        changeEditMode,
        projectCloseIssue,
        removeIssue
      }) => (
        <React.Fragment>
          <div className={classes.heroContent}>
            <IssueCreator
              createIssue={issueInject}
              project={projectInfo.title}
            />
          </div>
          <div className={classes.layout}>
            <Issues
              projectIssues={projectInfo}
              issueEdit={changeEditMode}
              closeIssue={projectCloseIssue}
              delIssue={removeIssue}
            />
          </div>
        </React.Fragment>
      )}
    </IssuesContext.Consumer>
  )
}
IssueList.propTypes = {
  classes: PropTypes.shape({})
}
export default withStyles(styles)(IssueList)
