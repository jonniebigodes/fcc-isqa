import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import TextField from '@material-ui/core/TextField'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import CommentIcon from '@material-ui/icons/Comment'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import PropTypes from 'prop-types'
import uuid from 'uuid'
import {PersonalLibraryContext} from '../../contexts/PersonalLibraryContext'

// import '../../Assets/css/app.css'

const styles = theme => ({
  root: {
    // paddingTop: theme.spacing.unit * 4,
    // paddingBottom: theme.spacing.unit * 4,
    width: '100%',
    height: '100%'
  },
  list: {
    marginLeft: theme.spacing.unit,
    width: '300px'
  },
  button: {
    margin: theme.spacing.unit
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    width: 200
  },
  listitem: {
    border: '1px solid #008080',
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    background: 'white',
    transition: 'all ease-out 150ms',
    marginTop:theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  title: {
    height: '48px',
    marginTop: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    overflow: 'hidden',
    flex: 1,
    textOverflow: 'ellipsis'
  }
})

const expandedBook = props => {
  const {classes, bookdata} = props // eslint-disable-line
  const {title, comments, id} = bookdata
  return (
    <PersonalLibraryContext.Consumer>
      {({expandBook, bookDelete, CommentAdd}) => (
        <div className={classes.listitem}>
          <Tooltip title="remove book">
            <IconButton
              className={classes.button}
              aria-label="Delete"
              onClick={() => bookDelete()}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <div className={classes.title}>
            <Typography component="p" gutterBottom>
              {title}
            </Typography>
          </div>
          <div className={classes.title}>
            <Typography component="p" gutterBottom>
              {`Comments: ${comments.length}`}
            </Typography>
          </div>
          {/* <div className="title">
             <input
              type="text"
              value={title}
              readOnly
              placeholder="Input title"
              style={{textOverflow: 'ellipsis'}}
            />
          </div> */}
          {/* <div className="title">
            <input
              type="text"
              value={`Comments: ${comments.length}`}
              readOnly
              placeholder="Input title"
              style={{textOverflow: 'ellipsis'}}
            />
          </div> */}
          <Tooltip title="collapse">
            <IconButton
              onClick={() => expandBook(id)}
              className={classes.button}
              aria-label="collapse">
              <RemoveIcon />
            </IconButton>
          </Tooltip>

          <Divider />
          <div className={classes.root}>
            <Divider />
            {/* eslint-disable */}
            <List component="nav" className={classes.list}>
              {comments.map(item => (
                <ListItem key={`comment_${uuid.v4()}`}>
                  <ListItemText primary={item.commentText} />
                </ListItem>
              ))}
            </List>
            {/* eslint-enable */}
            <Divider />
            <div className={classes.container}>
              <TextField
                className={classes.textField}
                helperText="Insert comment"
              />
              <Tooltip title="Add comment">
                <IconButton
                  className={classes.button}
                  onClick={() => CommentAdd()}
                  aria-label="Add comment">
                  <CommentIcon />
                </IconButton>
              </Tooltip>

              {/* <Button
                variant="contained"
                size="small"
                color="primary"
                aria-label="Add comment"
                className={classes.button}
                onClick={() => CommentAdd()}>
                Add comment
              </Button> */}
            </div>
          </div>
        </div>
      )}
    </PersonalLibraryContext.Consumer>
  )
}
const normalBook = props => {
  const {bookdata, classes} = props // eslint-disable-line
  const {title, comments, id} = bookdata
  return (
    <PersonalLibraryContext.Consumer>
      {({expandBook, bookDelete}) => (
        <div className={classes.listitem}>
          <Tooltip title="remove book">
            <IconButton
              className={classes.button}
              aria-label="Delete"
              onClick={() => bookDelete()}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <div className={classes.title}>
            <Typography component="p" gutterBottom>
              {title}
            </Typography>
          </div>
          {/* <div className="title">
            <input
              type="text"
              value={title}
              readOnly
              placeholder="Input title"
              style={{textOverflow: 'ellipsis'}}
            />
          </div> */}
          <div className={classes.title}>
            <Typography component="p" gutterBottom>
              {`Comments: ${comments.length}`}
            </Typography>
          </div>
          {/* <div className="title">
            <input
              type="text"
              value={`Comments: ${comments.length}`}
              readOnly
              placeholder="Input title"
              style={{textOverflow: 'ellipsis'}}
            />
          </div> */}
          <Tooltip title="expand">
            <IconButton
              onClick={() => expandBook(id)}
              className={classes.button}
              aria-label="expand">
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </PersonalLibraryContext.Consumer>
  )
}
const Book = props => {
  /* eslint-disable*/
  const {bookdata} = props
  const {expanded} = bookdata
  /* eslint-enable */
  return expanded ? expandedBook(props) : normalBook(props)
}

Book.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line
  CommentAdd: PropTypes.func,
  bookdata: PropTypes.shape({
    id: PropTypes.string,
    expanded: PropTypes.bool,
    title: PropTypes.string,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        commentText: PropTypes.string,
        dateadded: PropTypes.instanceOf(Date)
      })
    )
  })
}
export default withStyles(styles)(Book)
