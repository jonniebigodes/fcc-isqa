import React, {Component} from 'react'
import axios from 'axios'
import uuid from 'uuid'
import {projectsData} from '../DummyData/DummyIssues'

export const ProjectsContext = React.createContext()

const projectsLocalEndpoint = 'http://localhost:5000/api/projects'
const projectsRemoteEndpoint = 'https://fcc-isqa.herokuapp.com/api/projects'

export class ProjectsProvider extends Component {
  state = {
    showEndpoints: false,
    isloading: true,
    appIsError: false,
    appErrorMessage: '',
    projects: []
  }

  componentDidMount() {
    setTimeout(() => {
      this.fetchProjects()
    }, 1000)
  }

  // #region fetch projects

  /**
   * fat arrow function to fetch the projects
   */
  fetchProjects = () => {
    if (process.env.NODE_ENV === 'stories') {
      this.setState({dataIssues: projectsData, isloading: false})
    } else {
      axios
        .get(
          `${
            process.env.NODE_ENV !== 'production'
              ? projectsLocalEndpoint
              : projectsRemoteEndpoint
          }/cprojects`
        )
        .then(result => {
          const {data} = result

          this.setState({projects: data.projects, isloading: false})
        })
        .catch(err => {
          /*eslint-disable */
          console.log('====================================')
          console.log(`error getting issues data=>${err}`)
          console.log('====================================')
          this.setState({
            appIsError: true,
            isloading: false,
            appErrorMessage: 'Something went bad...really bad'
          })
          /* eslint-enable */
        })
    }
  }
  // #endregion

  // #region create_project
  /**
   * fat arrow function to generate a new project
   * @param {String} value title of the project
   */
  createProject = value => {
    if (process.env.NODE_ENV === 'stories') {
      this.setState(prevstate => ({
        dataIssues: [
          ...prevstate.dataIssues,
          {
            id: uuid.v4(),
            title: value,
            creationdate: new Date().toISOString(),
            issues: []
          }
        ]
      }))
    } else {
      axios
        .post(
          `${
            process.env.NODE_ENV !== 'production'
              ? projectsLocalEndpoint
              : projectsRemoteEndpoint
          }`,
          {
            title: value
          }
        )
        .then(result => {
          const {data} = result
          this.setState(prevstate => ({
            projects: [
              ...prevstate.projects,
              {
                id: data.idproject,
                title: value,
                creationdate: new Date().toISOString(),
                issues: []
              }
            ]
          }))
        })
        .catch(err => {
          /*eslint-disable */
          console.log('====================================')
          console.log(`error creating project=>${err}`)
          console.log('====================================')
          this.setState({
            appIsError: true,
            appErrorMessage:
              'Something went bad...really bad when the project was being created'
          })
          /* eslint-enable */
        })
    }
  }
  // #endregion

  // #region project delete
  /**
   * fat arrow function to delete the project
   * @param  {String} value project identifier of the project to be deleted
   */
  deleteProject = value => {
    if (process.env.NODE_ENV === 'stories') {
      const {projects} = this.state
      const newProjects = projects.filter(x => x.id !== value)
      this.setState({projects: newProjects})
    } else {
      axios
        .delete(
          `${
            process.env.NODE_ENV !== 'production'
              ? projectsLocalEndpoint
              : projectsRemoteEndpoint
          }/${value}`
        )
        .then(() => {
          const {projects} = this.state
          const newProjects = projects.filter(x => x.id !== value)
          this.setState({projects: newProjects})
        })
        .catch(err => {
          /*eslint-disable */
          console.log('====================================')
          console.log(`error deleting project=>${err}`)
          console.log('====================================')
          this.setState({
            appError: true,
            appErrorMessage:
              'Something went bad...really bad while deleting the project'
          })
          /* eslint-enable */
        })
    }
  }
  // #endregion

  // #region endpoints
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
      <ProjectsContext.Provider
        value={{
          ...this.state,
          addProject: this.createProject,
          removeProject: this.deleteProject,
          endpointsVisible: this.showHideEndpoints
        }}>
        {/* eslint-disable */}
        {this.props.children}
        {/* eslint-enable */}
      </ProjectsContext.Provider>
    )
  }
}
