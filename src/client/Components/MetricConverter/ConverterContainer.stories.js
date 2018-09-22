import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import { withKnobs, object } from '@storybook/addon-knobs/react'; 
/* eslint-enable */
import ConverterContainer from './ConverterContainer'
import {MetricConvertProvider} from '../../contexts/MetricConverterContext'


const metricresulttest={
  initNum: 32,
  initUnit: "kg",
  returnNum: 70.54798144588088,
  returnUnit: "lbs",
  stringresult: "32 kilograms converts to 70.54798 pounds"
}

storiesOf('Convert Container', module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <MetricConvertProvider>{story()}</MetricConvertProvider>
  ))
  .add('default',()=>(<ConverterContainer metricresult={{}}/>))
  .add('result', () =>{return <ConverterContainer metricresult={object('metricresult',{...metricresulttest})}/>;} )
  .add('error invalid unit', () => (
    <ConverterContainer metricError metricErrorMessage="invalid unit" />
  ))
  .add('error invalid number', () => (
    <ConverterContainer metricError metricErrorMessage="invalid number" />
  ))
