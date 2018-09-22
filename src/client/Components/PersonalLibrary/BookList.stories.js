import React from 'react'
import {storiesOf} from '@storybook/react' // eslint-disable-line
import BookList from './BookList'
import {PersonalLibraryProvider} from '../../contexts/PersonalLibraryContext'
// #region data book
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
]
// #endregion

storiesOf('Book List', module)
  .addDecorator(story => <div style={{padding: '3rem'}}>{story()}</div>)
  .addDecorator(providerstory => (
    <PersonalLibraryProvider>{providerstory()}</PersonalLibraryProvider>
  ))
  .add('default', () => <BookList Books={BookData} loading={false} />)
  .add('empty', () => <BookList Books={[]} loading={false} />)
  .add('loading', () => <BookList Books={[]} loading />)
