import React from 'react'
import {storiesOf} from '@storybook/react' // eslint-disable-line
import BookList from './BookList'
import {PersonalLibraryProvider} from '../../contexts/PersonalLibraryContext'
import {dummyData} from '../../DummyData/DummyLibrary'

storiesOf('Book List', module)
  .addDecorator(story => <div style={{padding: '3rem'}}>{story()}</div>)
  .addDecorator(providerstory => (
    <PersonalLibraryProvider>{providerstory()}</PersonalLibraryProvider>
  ))
  .add('default', () => <BookList Books={dummyData} loading={false} />)
  .add('empty', () => <BookList Books={[]} loading={false} />)
  .add('loading', () => <BookList Books={[]} loading />)
