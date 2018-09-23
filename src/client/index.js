import React from 'react'
import {render} from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import  CssBaseline  from '@material-ui/core/CssBaseline';
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'
import Loadable from 'react-loadable'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import UrlNotFound from './Components/UrlNotFound'
import Loader from './Components/Loader/Loader'
import Template from './Template/index'


const theme=createMuiTheme({
  palette:{
    primary:green,
    secondary:lime,
    contrastThreshold: 3,
    tonalOffset: 0.2,
  }
})

const Personal = Loadable({
  loader: () => import('./Components/PersonalLibrary/BookApp'),
  loading: Loader,
  delay: 300,
  timeout: 20000
})
const Metric = Loadable({
  loader: () => import('./Components/MetricConverter/ConverterApp'),
  loading: Loader,
  delay: 300,
  timeout: 20000
})
const Messages = Loadable({
  loader: () => import('./Components/MessageBoard/MessageBoardApp'),
  loading: Loader,
  delay: 300,
  timeout: 20000
})
const IssueTrack = Loadable({
  loader: () => import('./Components/IssueTracker/IssueTrackerApp'),
  loading: Loader,
  delay: 300,
  timeout: 20000
})
const Stocks = Loadable({
  loader: () => import('./Components/StockSearcher/StockApp'),
  loading: Loader,
  delay: 300,
  timeout: 20000
})
const Home = Loadable({
  loader: () => import('./Components/App'),
  loading: Loader,
  delay: 300,
  timeout: 20000
})

render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline/>
    <BrowserRouter>
    <Template>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/books" exact component={Personal} />
        <Route path="/issuetracker" exact component={IssueTrack} />
        <Route path="/messageboards" exact component={Messages} />
        <Route path="/metrics" exact component={Metric} />
        <Route path="/stockdata" exact component={Stocks} />
        <Route component={UrlNotFound} />
      </Switch>
    </Template>
  </BrowserRouter>
  </MuiThemeProvider>,
  document.getElementById('root')
)
if (module.hot) {
  module.hot.accept()
}