import React from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import {PersonalLibraryContext} from '../../contexts/PersonalLibraryContext'


const styles = theme => ({
  container: {
    display:'block',
    width:'auto',
    height:'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    background: '#ffff',
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 500,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    
    
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  form:{
      width:'100%',
      marginTop: theme.spacing.unit
  },
  inputMessage: {
    marginTop: theme.spacing.unit*2
  },
  button: {
    margin: theme.spacing.unit
  }
})

const BookAdd = props => {
  const {classes} = props
  return (
    <PersonalLibraryContext.Consumer>
      {({bookName, BookAdd, setBookName}) => (
        <div className={classes.container}>
          <Paper className={classes.paper}>
            <Typography gutterBottom variant="headline" align="center">
              Add a book to the collection
            </Typography>
            <form className={classes.form} onSubmit={e=>e.preventDefault()}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="book">Add a book </InputLabel>
                <Input value={bookName}
                onChange={event=>setBookName(event.target.value)}
                inputProps={{
                  'aria-label':'Add book',

                }}/>
              </FormControl>
            </form>
            <Tooltip title="Add the book">
              <Button variant="contained" color="primary" fullWidth onClick={() => BookAdd()}>
                Save Book
              </Button>
            </Tooltip>
          </Paper>
        </div>
      )}
    </PersonalLibraryContext.Consumer>
  )
}
BookAdd.propTypes = {
  classes: PropTypes.shape({})
}
export default withStyles(styles)(BookAdd)
