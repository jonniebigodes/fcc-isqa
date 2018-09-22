import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import StoryRouter from 'storybook-react-router'
/* eslint-enable */

import Header from './Header'

storiesOf('Header', module)
  .addDecorator(StoryRouter())
  .add('default', () => <Header />)
