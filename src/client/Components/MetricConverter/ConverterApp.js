import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {
  MetricConvertProvider,
  MetricConverterContext
} from '../../contexts/MetricConverterContext'
import ConverterContainer from './ConverterContainer'

const styles = theme => ({
  root: {
    height: 410,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})
const MetricConverterApp = props => {
  const {classes} = props
  return (
    <div className={classes.root}>
      <Helmet
        title="Super Duper Metric Converter"
        meta={[
          {
            name: 'description',
            content: 'freeCodeCamp ISQA Challenges Metric Converter'
          },
          {
            name: 'keywords',
            content: 'react,fcc,challenges,isqa,metric,imperial,converter'
          }
        ]}
      />
      <MetricConvertProvider>
        <MetricConverterContext.Consumer>
          {({isloading, appError, appErrorMessage, convertresult}) => (
            <ConverterContainer
              loading={isloading}
              metricError={appError}
              metricErrorMessage={appErrorMessage}
              metricresult={convertresult}
            />
          )}
        </MetricConverterContext.Consumer>
      </MetricConvertProvider>
    </div>
  )
}
MetricConverterApp.propTypes = {
  classes: PropTypes.object //eslint-disable-line
}
export default withStyles(styles)(MetricConverterApp)
