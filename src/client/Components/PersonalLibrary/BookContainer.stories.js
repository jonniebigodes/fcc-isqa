import React from 'react'
import {storiesOf, action} from '@storybook/react' // eslint-disable-line
import BookContainer from './BookContainer'
import {PersonalLibraryProvider} from '../../contexts/PersonalLibraryContext'

export const actions = {
  getdata: action('getdata')
}
storiesOf('Book container', module)
  .addDecorator(story => <div style={{padding: '3rem'}}>{story()}</div>)
  .addDecorator(providerstory => (
    <PersonalLibraryProvider>{providerstory()}</PersonalLibraryProvider>
  ))
  .add('empty', () => <BookContainer {...actions} />)
  .add('dummy data', () => <BookContainer {...actions} />)
  .add('error', () => <BookContainer appError {...actions} />)
