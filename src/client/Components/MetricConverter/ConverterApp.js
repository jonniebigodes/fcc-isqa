import React from 'react'
import Helmet from 'react-helmet'

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'

import {
  MetricConvertProvider,
  MetricConverterContext
} from '../../contexts/MetricConverterContext'
import ConverterContainer from './ConverterContainer'

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: lime,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})

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
