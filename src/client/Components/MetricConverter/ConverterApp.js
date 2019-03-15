import React from 'react'
import Helmet from 'react-helmet'

import {MuiThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import {theme} from '../../theme/MuiTheme'

import {
  MetricConvertProvider,
  MetricConverterContext
} from '../../contexts/MetricConverterContext'
import ConverterContainer from './ConverterContainer'

const MetricConverterApp = () => {
  return (
    <div style={{height: 410, marginLeft: 'auto', marginRight: 'auto'}}>
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
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
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
      </MuiThemeProvider>
    </div>
  )
}

export default MetricConverterApp
