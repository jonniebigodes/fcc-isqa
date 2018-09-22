import React, {Component} from 'react'
import axios from 'axios'

export const MetricConverterContext = React.createContext()

const localEndPoint = 'http://localhost:5000/api/convert/'
const remoteEndPoint = 'https://fcc-isqa.herokuapp.com/api/convert/'

export class MetricConvertProvider extends Component {
  state = {
    convertInput: '',
    isloading: false,
    appError: false,
    appErrorMessage: '',
    convertresult: {}
  }

  setInput = value => {
    this.setState({convertInput: value})
  }

  makeConversion = () => {
    const {convertInput} = this.state
    if (convertInput !== '') {
      axios
          .get(
            `${
              process.env.NODE_ENV !== 'production'
                ? localEndPoint
                : remoteEndPoint
            }?input=${convertInput}`
          )
          .then(result => {
            this.setState(
              typeof result.data === 'string'
                ? {appError: true, appErrorMessage: result.data}
                : {convertresult: result.data}
            )
          })
          .catch(err => {
            /*eslint-disable */
            console.log('====================================')
            console.log(`error converting value=>${err}`)
            console.log('====================================')
            this.setState({
              appError: true,
              appErrorMessage: 'Something went bad...really bad'
            })
            /* eslint-enable */
          })
    }
  }

  render() {
    return (
      <MetricConverterContext.Provider
        value={{
          ...this.state,
          addInput: this.setInput,
          convert: this.makeConversion,
          addInputConvert:this.setInput
        }}>
        {this.props.children} {/*eslint-disable-line*/}
      </MetricConverterContext.Provider>
    )
  }
}
