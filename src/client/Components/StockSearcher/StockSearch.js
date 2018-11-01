import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import {StockPriceContext} from '../../contexts/StockPriceContext'

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main
  },
  avatarCollapsed: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
    color: '#ffffff'
  }
})

class StockSearch extends Component {
  state = {
    firstStockTicker: '',
    secondStockTicker: '',
    likes: false,
    hasBoth: false
  }

  /**
   * fat arrow function to handle the change of the first ticker to search
   * @param {Object} e object to be passed down to add the information of the first ticker
   */
  onChangeFirstTicker = e => {
    this.setState({firstStockTicker: e.target.value})
  }

  /**
   * fat arrow function to handle the change of the second ticker to search
   * @param {Object} e object to be passed down to add the information of the second ticker
   */
  onChangeSecondTicker = e => {
    this.setState({secondStockTicker: e.target.value})
  }

  /**
   * fat arrow function to handle the checkbox change for one or two stocks
   * @param {Object} e object to handle the change for one or two stocks to search
   */
  onchangetoBoth = () => {
    this.setState(prevstate => ({hasBoth: !prevstate.hasBoth}))
  }

  /**
   * fat arrow function to handle the change on the like
   * @param {Object} e value to change the data of the like
   */
  onlikeFirstTicker = () => {
    this.setState(prevstate => ({likes: !prevstate.likes}))
  }

  render() {
    const {classes} = this.props
    const {firstStockTicker, secondStockTicker, hasBoth, likes} = this.state
    return (
      <StockPriceContext.Consumer>
        {({search}) => (
          <div className={classes.layout}>
            <Paper className={classes.paper}>
              <Typography variant="h5">Search Stocks</Typography>
              <form className={classes.form} onSubmit={e => e.preventDefault()}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="firstTicker">First Ticker</InputLabel>
                  <Input
                    id="firstTicker"
                    name="FirstTicker"
                    autoComplete="none"
                    autoFocus
                    value={firstStockTicker}
                    onChange={this.onChangeFirstTicker}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite />}
                        checked={likes}
                        onChange={this.onlikeFirstTicker}
                      />
                    }
                    label="Like"
                  />
                </FormControl>
                {hasBoth&&(
                  <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="secondTicker">Second Ticker</InputLabel>
                  <Input
                    name="secondTicker"
                    id="SecondTicker"
                    autoComplete="none"
                    value={secondStockTicker}
                    disabled={!hasBoth}
                    onChange={this.onChangeSecondTicker}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite />}
                        disabled={!hasBoth}
                        checked={hasBoth ? likes : false}
                      />
                    }
                    label="Like"
                  />
                </FormControl>
                )}
                
                <FormControl margin="normal" required fullWidth>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={hasBoth}
                        onChange={this.onchangetoBoth}
                      />
                    }
                    label="Search Multiple?"
                  />
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="raised"
                  color="primary"
                  onClick={() =>
                    search(
                      hasBoth
                        ? {
                            firstTicker: firstStockTicker,
                            secondTicker: secondStockTicker,
                            likedTicker: likes ? true : undefined
                          }
                        : {
                            firstTicker: firstStockTicker,
                            likedTicker: likes ? true : undefined
                          }
                    )
                  }
                  className={classes.submit}>
                  Search
                </Button>
              </form>
            </Paper>
          </div>
        )}
      </StockPriceContext.Consumer>
    )
  }
}
StockSearch.propTypes = {
  classes: PropTypes.object.isRequired //eslint-disable-line
}
export default withStyles(styles)(StockSearch)
