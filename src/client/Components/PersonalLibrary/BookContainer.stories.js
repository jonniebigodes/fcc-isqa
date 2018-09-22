import React from 'react'
import {storiesOf, action} from '@storybook/react' // eslint-disable-line
import BookContainer from './BookContainer'
import {PersonalLibraryProvider} from '../../contexts/PersonalLibraryContext'

// #region dummy data
export const BookData = [
  {
    id: '507f1f77bcf86cd799439011',
    title: 'dummyBook 1',
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
  },
  {
    id: '507f1f77bcf86cd799439012',
    title: 'dummyBook 2',
    expanded: false,
    comments: [
      {
        commentText: 'two',
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
  },
  {
    id: '507f1f77bcf86cd799439013',
    title: 'dummyBook 3',
    expanded: false,
    comments: [
      {
        commentText: 'three',
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
  },
  {
    id: '507f1f77bcf86cd799439014',
    title: 'dummyBook 4',
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
  },
  {
    id: '507f1f77bcf86cd799439015',
    title: 'dummyBook 5',
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
  },
  {
    id: '507f1f77bcf86cd799439016',
    title: 'dummyBook 6',
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
]
// #endregion
export const actions = {
  getdata: action('getdata')
}
storiesOf('Book container', module)
  .addDecorator(story => <div style={{padding: '3rem'}}>{story()}</div>)
  .addDecorator(providerstory => (
    <PersonalLibraryProvider>{providerstory()}</PersonalLibraryProvider>
  ))
  .add('empty', () => <BookContainer {...actions} />)
  .add('dummy data', () => <BookContainer BooksData={BookData} {...actions} />)
  .add('error', () => <BookContainer appError {...actions} />)
