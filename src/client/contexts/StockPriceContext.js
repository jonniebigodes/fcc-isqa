import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import uuid from 'uuid'

export const StockPriceContext = React.createContext()

const localEndPoint = 'http://localhost:5000/api/stock-prices'
const remoteEndPoint = 'https://fcc-isqa.herokuapp.com/api/stock-prices'

export class StockPriceProvider extends Component {
  state = {
    results: [],
    stockError: false,
    stockErrorMessage: ''
  }

  // #region singleSearch
  /**
   * fat arrow function to search single stock ticker
   * @param {Object} value contains the stock ticker info and like
   * @param {string} value.firstTicker contains the first ticker
   * @param {string} value.likedTicker likes the ticker
   */
  searchSingle = value => {
    const {firstTicker, likedTicker} = value
    if (process.env.NODE_ENV === 'stories') {
      this.setState(prevstate => ({
        results: [
          ...prevstate.results,
          {
            id: uuid.v4(),
            ticker: firstTicker,
            tickerPrice: 200.5,
            tickerLikes: likedTicker ? 1 : 0
          }
        ]
      }))
    } else {
      const {results} = this.state
      const stockPresent = results.findIndex(x => x.ticker === firstTicker)
      if (stockPresent < 0) {
        axios
          .get(
            `${
              process.env.NODE_ENV !== 'production'
                ? localEndPoint
                : remoteEndPoint
            }?stock=${firstTicker}${likedTicker ? '&like=true' : ''}`
          )
          .then(result => {
            const {data} = result
            const {stockData} = data
            this.setState(prevstate => ({
              results: [
                ...prevstate.results,
                {
                  id: uuid.v4(),
                  ticker: stockData.stock,
                  tickerPrice: stockData.price,
                  tickerLikes: stockData.likes
                }
              ]
            }))
          })
          .catch(err => {
            /* eslint-disable */
            console.log('====================================')
            console.log(`error fetching single:\n${err}`)
            console.log('====================================')
            /* eslint-enable */
            this.setState({
              stockError: true,
              stockErrorMessage: 'Something went bad...really bad'
            })
          })
      }
    }
  }
  // #endregion

  // #region
  /**
   * fat arrow function to search both tickers
   * @param {Object} value contains the stock ticker information and like
   * @param {string} value.firstTicker contains the first ticker
   * @param {string} value.secondTicker contains the second ticker
   * @param {string} value.likedTicker likes the ticker
   */

  searchMultiple = value => {
    const {firstTicker, secondTicker, likedTicker} = value
    if (process.env.NODE_ENV === 'stories') {
      this.setState(prevstate => ({
        results: [
          ...prevstate.results,
          ...[
            {
              id: uuid.v4(),
              ticker: firstTicker,
              tickerPrice: 200.5,
              tickerLikes: likedTicker ? 1 : 0
            },
            {
              id: uuid.v4(),
              ticker: secondTicker,
              tickerPrice: 200.5,
              tickerLikes: likedTicker ? 1 : 0
            }
          ]
        ]
      }))
    } else {
      const {results} = this.state
      const firstPresent = results.findIndex(x => x.ticker === firstTicker)
      const secondPresent = results.findIndex(x => x.ticker === secondTicker)

      if (firstPresent < 0 && secondPresent < 0) {
        axios
          .get(
            `${
              process.env.NODE_ENV !== 'production'
                ? localEndPoint
                : remoteEndPoint
            }?stock=${firstTicker}&stock=${secondTicker}${
              likedTicker ? '&like=true' : ''
            }`
          )
          .then(result => {
            const {data} = result
            const {stockData} = data
            const dataresult = stockData.map(item => {
              return {
                id: uuid.v4(),
                ticker: item.stock,
                tickerPrice: item.price,
                tickerLikes: item.likes
              }
            })
            this.setState(prevstate => ({
              results: [...prevstate.results, ...dataresult]
            }))
          })
          .catch(err => {
            /* eslint-disable */
            console.log('====================================')
            console.log(`error fetching multiple:\n${err}`)
            console.log('====================================')
            /* eslint-enable */
            this.setState({
              stockError: true,
              stockErrorMessage: 'Something went bad...really bad'
            })
          })
      } else {
        this.searchSingle({
          firstTicker: firstPresent >= 0 ? secondTicker : firstTicker,
          likedTicker: value.likedTicker
        })
      }
    }
  }
  // #endregion

  // #region search
  /**
   * fat arrow function to search the tickers informaion
   * @param {Object} value contains the stock ticker information and like
   * @param {string} value.firstTicker contains the first ticker
   * @param {string} value.secondTicker contains the second ticker
   * @param {string} value.likedTicker likes the ticker
   */
  searchStocks = value => {
    const {secondTicker} = value
    if (secondTicker) {
      this.searchMultiple(value)
    } else {
      this.searchSingle(value)
    }
  }
  // #endregion

  cleanError = () => {
    this.setState({stockError: false, stockErrorMessage: ''})
  }

  render() {
    const {children} = this.props
    return (
      <StockPriceContext.Provider
        value={{
          ...this.state,
          search: this.searchStocks,
          ErrorReset: this.cleanError
        }}>
        {children}
      </StockPriceContext.Provider>
    )
  }
}
StockPriceProvider.propTypes = {
  children: PropTypes.object //eslint-disable-line
}
