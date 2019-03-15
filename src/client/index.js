import React from 'react'
import {render} from 'react-dom'
import Loadable from 'react-loadable'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import UrlNotFound from './Components/UrlNotFound'
import Loader from './Components/Loader/Loader'
import Template from './Template/index'

const Personal = Loadable({
  loader: () => import('./Components/PersonalLibrary/BookApp'),
  loading: Loader,
  delay: 1000,
  timeout: 20000
})
const Metric = Loadable({
  loader: () => import('./Components/MetricConverter/ConverterApp'),
  loading: Loader,
  delay: 1000,
  timeout: 20000
})
const MessageBoards = Loadable({
  loader: () => import('./Components/MessageBoard/Boards/MessageBoardApp'),
  loading: Loader,
  delay: 1000,
  timeout: 20000
})

const MessageBoardThreads = Loadable({
  loader: () => import('./Components/MessageBoard/Threads/Threads'),
  loading: Loader,
  delay: 1000,
  timeout: 20000
})
const MessageBoardReplies = Loadable({
  loader: () => import('./Components/MessageBoard/Replies/Replies'),
  loading: Loader,
  delay: 1000,
  timeout: 20000
})
const IssueTrack = Loadable({
  loader: () => import('./Components/IssueTracker/Issues/IssueTracker'),
  loading: Loader,
  delay: 1000,
  timeout: 20000
})
const ProjectTrack = Loadable({
  loader: () => import('./Components/IssueTracker/Projects/ProjectTracker'),
  loading: Loader,
  delay: 2000,
  timeout: 20000
})

const Stocks = Loadable({
  loader: () => import('./Components/StockSearcher/StockApp'),
  loading: Loader,
  delay: 1000,
  timeout: 20000
})
const Home = Loadable({
  loader: () => import('./Components/App'),
  loading: Loader,
  delay: 2000,
  timeout: 20000
})

render(
  <BrowserRouter>
    <Template>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/books" exact component={Personal} />
        <Route path="/issuetracker" exact component={ProjectTrack} />
        <Route path="/issuetracker/:project" component={IssueTrack} />
        <Route path="/messageboards" exact component={MessageBoards} />
        <Route path="/b/:board" exact component={MessageBoardThreads} />
        <Route path="/t/:board/:thread" exact component={MessageBoardReplies} />
        <Route path="/metrics" exact component={Metric} />
        <Route path="/stockdata" exact component={Stocks} />
        <Route component={UrlNotFound} />
      </Switch>
    </Template>
  </BrowserRouter>,
  document.getElementById('root')
)
if (module.hot) {
  module.hot.accept()
}
