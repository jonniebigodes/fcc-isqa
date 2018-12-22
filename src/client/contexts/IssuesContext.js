import React, {Component} from 'react'
import axios from 'axios'
import {issuesdata} from '../DummyData/DummyIssues'

export const IssuesContext = React.createContext()
const issuesLocalEndPoint = 'http://localhost:5000/api/issues'
const issuesRemoteEndpoint = 'https://fcc-isqa.herokuapp.com/api/issues'

export class IssuesProvider extends Component {
  state = {
    showEndpoints: false,
    isloading: true,
    appError: false,
    issueIsEdit: false,
    selectedIssue: '',
    editData: {},
    AppErrorMessage: '',
    projectInfo: {}
  }

  componentDidMount() {
    const {children} = this.props // eslint-disable-line
    const {props} = children
    const {projectID} = props
    this.fetchData(projectID)
  }

  // #region editMode
  /**
   * fat arrow function to edit the issue
   * @param {String} value id of the issue
   */
  setEditMode = value => {
    this.setState(prevstate => ({
      issueIsEdit: !prevstate.issueIsEdit,
      selectedIssue: value,
      editData: value !== '' ? this.fetchIssue(value) : {}
    }))
  }

  // #endregion

  // #region data_retrieve
  /**
   * fat arrow function to fetch info for the project
   * @param {String} value string for the project id
   *
   */
  fetchData = value => {
    if (process.env.NODE_ENV === 'stories') {
      /* const {storyLoad} = this.state
      if (storyLoad > 0) {
        return null
      } */
      const itempos = issuesdata.findIndex(x => x.id === value)
      const currentIssue = issuesdata[itempos]
      this.setState({projectInfo: currentIssue, storyLoad: 1, isloading: false})
    } else {
      axios
        .get(
          `${
            process.env.NODE_ENV !== 'production'
              ? issuesLocalEndPoint
              : issuesRemoteEndpoint
          }/icache/${value}`
        )
        .then(result => {
          const {data} = result
          const {issuesData} = data
          this.setState({projectInfo: issuesData, isloading: false})
        })
        .catch(err => {
          /*eslint-disable */
          console.log('====================================')
          console.log(`error getting issues data=>${err}`)
          console.log('====================================')
          this.setState({
            appError: true,
            isloading: false,
            appErrorMessage:
              'Something went bad fetching the project issues...really bad'
          })
          /* eslint-enable */
        })
    }
  }

  // #endregion

  // #region create
  /**
   * fat arrow function to inject a new issue on the project
   * @param {Object} value object containing the new issue information
   * @param {String} value.titleofissue the title of the issue
   * @param {String} value.textofissue issue text
   * @param {String} value.creator issue creator
   * @param {String} value.issueassigned string containing the person assigned
   * @param {String} value.issuestatus status of the issue
   */
  issueCreator = value => {
    const {projectInfo} = this.state
    axios
      .post(
        `${
          process.env.NODE_ENV !== 'production'
            ? issuesLocalEndPoint
            : issuesRemoteEndpoint
        }/${projectInfo.id}`,
        {
          issue_title: value.titleofissue,
          issue_text: value.textofissue,
          created_by: value.issuecreator,
          assigned:
            value.issueassigned !== undefined ? value.issueassigned : undefined,
          status:
            value.issuestatus !== undefined ? value.issuestatus : undefined
        }
      )
      .then(result => {
        const {data} = result
        const {newIssue} = data
        this.setState(prevstate => ({
          projectInfo: {
            ...prevstate.projectInfo,
            issues: [
              ...prevstate.projectInfo.issues,
              {
                _id: newIssue._id, // eslint-disable-line
                issuecreated: newIssue.created_on,
                issueupdated: newIssue.updated_on,
                open: true,
                project: prevstate.projectInfo.id,
                issuetitle: newIssue.issue_title,
                text: newIssue.issue_text,
                creator: newIssue.created_by,
                assigned: newIssue.assigned,
                status: newIssue.status_text
              }
            ]
          }
        }))
      })
      .catch(err => {
        /*eslint-disable */
        console.log('====================================')
        console.log(`error creating issue=>${err}`)
        console.log('====================================')
        this.setState({
          appError: true,
          appErrorMessage:
            'Something went bad...really bad when the project was being created'
        })
        /* eslint-enable */
      })
  }

  // #endregion

  // #region delete
  /**
   * fat arrow function to delete the issue
   * @param {String} value containing the id of the issue
   */
  deleteIssue = value => {
    const {projectInfo} = this.state
    axios
      .delete(
        `${
          process.env.NODE_ENV !== 'production'
            ? issuesLocalEndPoint
            : issuesRemoteEndpoint
        }/${projectInfo.id}?issue=${value}`
      )
      .then(() => {
        const {issues} = projectInfo
        const newIssues = issues.filter(x => x._id !== value) // eslint-disable-line
        this.setState(prevstate => ({
          projectInfo: {
            ...prevstate.projectInfo,
            issues: newIssues
          }
        }))
      })
      .catch(err => {
        /*eslint-disable */
        console.log('====================================')
        console.log(`error deleting project=>${err}`)
        console.log('====================================')
        this.setState({
          appError: true,
          appErrorMessage:
            'Something went bad...really bad while deleting the issue'
        })
        /* eslint-enable */
      })
  }
  // #endregion

  // #region issue_closer
  /**
   * fat arrow function to close a issue within a project
   * @param {String} value id of the issue
   */
  issueCloser = value => {
    const {projectInfo} = this.state
    axios
      .put(
        `${
          process.env.NODE_ENV !== 'production'
            ? issuesLocalEndPoint
            : issuesRemoteEndpoint
        }/${projectInfo.id}?issue=${value}`,
        {open: 'false'}
      )
      .then(() => {
        const {issues} = projectInfo
        const updateIssues = [...issues]
        const posIssue = updateIssues.findIndex(x => x._id === value) // eslint-disable-line
        updateIssues[posIssue].open = false
        this.setState(prevstate => ({
          projectInfo: {
            ...prevstate.projectInfo,
            issues: updateIssues
          }
        }))
      })
      .catch(err => {
        /*eslint-disable */
        console.log('====================================')
        console.log(`error closing issue=>${err}`)
        console.log('====================================')
        this.setState({
          appError: true,
          appErrorMessage: 'Something went bad...really bad closing issue'
        })
        /* eslint-enable */
      })
  }

  // #endregion

  // #region issue_updater
  /**
   * fat arrow function to close a issue within a project
   * @param {Object} value Object containing information about the issue
   * @param {String} value.issueid identifier of the issue
   * @param {String} value.titleofissue issue title
   * @param {String} value.textofissue issue text
   * @param {String} value.issuecreator creator
   * @param {String} value.issueassigned issue assinged to
   * @param {String} value.issuestatus status of the issue
   */

  updateIssueData = value => {
    const {projectInfo, selectedIssue} = this.state
    const {issues} = projectInfo
    const {
      titleofissue,
      textofissue,
      issuecreator,
      issueassigned,
      issuestatus
    } = value
    axios
      .put(
        `${
          process.env.NODE_ENV !== 'production'
            ? issuesLocalEndPoint
            : issuesRemoteEndpoint
        }/${projectInfo.id}?issue=${selectedIssue}`,
        {
          issue_title: titleofissue,
          issue_text: textofissue,
          created_by: issuecreator,
          assigned: issueassigned,
          status: issuestatus
        }
      )
      .then(() => {
        const updatedIssues = [...issues]
        const posSelectedIssue = updatedIssues.findIndex(
          x => x._id === selectedIssue //eslint-disable-line
        )
        updatedIssues[posSelectedIssue].issueupdated = new Date().toISOString
        updatedIssues[posSelectedIssue].issuetitle = titleofissue
        updatedIssues[posSelectedIssue].text = textofissue
        updatedIssues[posSelectedIssue].creator = issuecreator
        updatedIssues[posSelectedIssue].assigned = issueassigned
        updatedIssues[posSelectedIssue].status = issuestatus

        this.setState(prevstate => ({
          selectedProject: {
            ...prevstate.selectedProject,
            issues: updatedIssues
          },
          selectedIssue: '',
          editData: {},
          issueIsEdit: false
        }))
      })
      .catch(err => {
        /*eslint-disable */
        console.log('====================================')
        console.log(`error updating issue=>${err}`)
        console.log('====================================')
        this.setState({
          appError: true,
          appErrorMessage: 'Something went bad...really bad updating issue'
        })
        /* eslint-enable */
      })
  }
  // #endregion

  // #region fetchIssueInfo
  /**
   * fat arrow function to fetch the issue data
   * @param {String} value project id
   */
  fetchIssue = value => {
    const {projectInfo} = this.state
    const {issues} = projectInfo
    const issuepos = issues.findIndex(x => x._id === value) // eslint-disable-line
    const issuetoedit = issues[issuepos]

    return {
      projectName: projectInfo.title,
      ...issuetoedit
    }
  }
  // #endregion

  // #region endpointsShow
  /**
   * fat arrow function to show hide endpoints
   */
  showHideEndpoints = () => {
    this.setState(prevstate => ({
      showEndpoints: !prevstate.showEndpoints
    }))
  }
  // #endregion

  render() {
    return (
      <IssuesContext.Provider
        value={{
          ...this.state,
          changeEditMode: this.setEditMode,
          issueInject: this.issueCreator,
          removeIssue: this.deleteIssue,
          projectCloseIssue: this.issueCloser,
          changeIssue: this.updateIssueData,
          endpointsVisible: this.showHideEndpoints
        }}>
        {/* eslint-disable */}
        {this.props.children}
        {/* eslint-enable */}
      </IssuesContext.Provider>
    )
  }
}
