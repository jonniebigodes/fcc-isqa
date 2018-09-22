import React from 'react'
import {storiesOf} from '@storybook/react' // eslint-disable-line
import BookEndpoints from './BookEndpoints'

storiesOf('Endpoints', module).add('default', () => <BookEndpoints />)
