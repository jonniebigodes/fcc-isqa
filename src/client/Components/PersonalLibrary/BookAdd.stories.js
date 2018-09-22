import React from 'react'
import {storiesOf} from '@storybook/react' // eslint-disable-line
import {action} from '@storybook/addon-actions' // eslint-disable-line
import BookAdd from './BookAdd'
import {PersonalLibraryProvider} from '../../contexts/PersonalLibraryContext'

/* export const NameofTheBook = ''
export const actions = {
  addBookName: action('addNameBook')
} */
export const actions = {
  BookAdd: action('BookAdd'),
  setBookName: action('setBookName')
}
storiesOf('BookAdd', module)
  .addDecorator(story => (
    <PersonalLibraryProvider>{story()}</PersonalLibraryProvider>
  ))
  .add('default', () => <BookAdd {...actions} />)
