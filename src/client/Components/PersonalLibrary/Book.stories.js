import React from 'react'
/* eslint-disable */
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {withKnobs, object} from '@storybook/addon-knobs/react'
/* eslint-enable */
import {PersonalLibraryProvider} from '../../contexts/PersonalLibraryContext'
import Book from './Book'

// #region defaultbook
export const defaultBook = {
  id: '507f1f77bcf86cd799439011',
  title: 'dummyBook',
  expanded: false,
  comments: [
    {
      commentText: 'one',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'two',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'three',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'four',
      dateadded: new Date(2018, 0, 1, 9, 0)
    }
  ]
}

// #endregion

// #region expanded book full
export const expandedBook = {
  id: '507f1f77bcf86cd799439011',
  title: 'dummyBook',
  expanded: true,
  comments: [
    {
      commentText: 'one',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'two',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'three',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'four',
      dateadded: new Date(2018, 0, 1, 9, 0)
    }
  ]
}
// #endregion

// #region one comment
export const OneCommentBook = {
  id: '507f1f77bcf86cd799439011',
  title: 'dummyBook',
  expanded: true,
  comments: [
    {
      commentText: 'one',
      dateadded: new Date(2018, 0, 1, 9, 0)
    }
  ]
}
// #endregion

// #region two comments
export const TwoCommentsBook = {
  id: '507f1f77bcf86cd799439011',
  title: 'dummyBook',
  expanded: true,
  comments: [
    {
      commentText: 'one',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'two',
      dateadded: new Date(2018, 0, 1, 9, 0)
    }
  ]
}
// #endregion

// #region three comments
export const ThreeCommentsBook = {
  id: '507f1f77bcf86cd799439011',
  title: 'dummyBook',
  expanded: true,
  comments: [
    {
      commentText: 'one',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'two',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'three',
      dateadded: new Date(2018, 0, 1, 9, 0)
    }
  ]
}
// #endregion

// #region five comments
export const FivesCommentsBook = {
  id: '507f1f77bcf86cd799439011',
  title: 'dummyBook',
  expanded: true,
  comments: [
    {
      commentText: 'one',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'two',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'three',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'four',
      dateadded: new Date(2018, 0, 1, 9, 0)
    },
    {
      commentText: 'five',
      dateadded: new Date(2018, 0, 1, 9, 0)
    }
  ]
}
// #endregion

export const actions = {
  expandBook: action('expandBook'),
  CommentAdd: action('CommentAdd'),
  addCommentText: action('addCommentText'),
  deleteBook: action('delete')
}
storiesOf('Book', module)
  .addDecorator(withKnobs)
  .addDecorator(story => (
    <PersonalLibraryProvider>{story()}</PersonalLibraryProvider>
  ))
  .add('default', () => <Book bookdata={defaultBook} {...actions} />)
  .add('expanded', () => <Book bookdata={expandedBook} {...actions} />)
  .add('one comment', () => <Book bookdata={OneCommentBook} {...actions} />)
  .add('two comment', () => <Book bookdata={TwoCommentsBook} {...actions} />)
  .add('three comment', () => (
    <Book bookdata={ThreeCommentsBook} {...actions} />
  ))
  .add('five comment', () => <Book bookdata={FivesCommentsBook} {...actions} />)
