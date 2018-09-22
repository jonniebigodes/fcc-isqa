import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import StoryRouter from 'storybook-react-router'
/* eslint-enable */
import UrlNotFound from './UrlNotFound'

storiesOf('Not found', module)
  .addDecorator(StoryRouter())
  .add('default', () => <UrlNotFound />)
