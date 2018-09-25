import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {withKnobs, object, text} from '@storybook/addon-knobs/react'
/* eslint-enable */
import Converter from './Converter'
import {MetricConvertProvider} from '../../contexts/MetricConverterContext'

export const actions = {
  convert: action('convert')
}

storiesOf('Convert Converter', module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <MetricConvertProvider>{story()}</MetricConvertProvider>
  ))
  .add('default', () => (
    <Converter {...actions}>{text('convertInput', 'Hello Button')}</Converter>
  ))
