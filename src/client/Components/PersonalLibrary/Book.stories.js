import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {withKnobs, object} from '@storybook/addon-knobs/react'
/* eslint-enable */
import Book from './Book'
import {
  defaultBook,
  expandedBook,
  OneCommentBook,
  TwoCommentsBook,
  ThreeCommentsBook,
  FivesCommentsBook
} from '../../DummyData/DummyLibrary'

export const actions = {
  ShowComments: action('ShowComments'),
  AddBookComment: action('AddBookComment'),
  DeleteBook: action('DeleteBook')
}
storiesOf('Book', module)
  .addDecorator(withKnobs)
  .add('default', () => <Book bookdata={defaultBook} {...actions} />)
  .add('expanded', () => <Book bookdata={expandedBook} {...actions} />)
  .add('one comment', () => <Book bookdata={OneCommentBook} {...actions} />)
  .add('two comment', () => <Book bookdata={TwoCommentsBook} {...actions} />)
  .add('three comment', () => (
    <Book bookdata={ThreeCommentsBook} {...actions} />
  ))
  .add('five comment', () => <Book bookdata={FivesCommentsBook} {...actions} />)
