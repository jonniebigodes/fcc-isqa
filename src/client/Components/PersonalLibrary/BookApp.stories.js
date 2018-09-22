import React from 'react'
import {storiesOf} from '@storybook/react' // eslint-disable-line
import BookApp from './BookApp'

storiesOf('Book App', module).add('default', () => <BookApp />)
