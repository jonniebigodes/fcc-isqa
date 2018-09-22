import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import StoryRouter from 'storybook-react-router'
/* eslint-enable */
import App from './App'

storiesOf('App', module)
  .addDecorator(StoryRouter())
  .add('default', () => <App />)
