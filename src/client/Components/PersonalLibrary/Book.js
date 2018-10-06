import React, {Component} from 'react'
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

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  list: {
    padding: theme.spacing.unit,
    width: '100%'
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
    marginTop: theme.spacing.unit,
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

class Book extends Component {
  state = {
    bookComment: ''
  }

  onDeleteHandler = () => {
    const {DeleteBook} = this.props
    DeleteBook()
  }

  onChangeHandler = event => {
    this.setState({bookComment: event.target.value})
  }

  onExpandHandler = () => {
    const {ShowComments, bookdata} = this.props
    ShowComments(bookdata.id)
  }

  onCommentAdd = () => {
    const {AddBookComment} = this.props
    const {bookComment} = this.state

    if (bookComment !== '') {
      AddBookComment(bookComment)
    }
  }

  render() {
    const {bookdata, classes} = this.props
    const {expanded, title, comments} = bookdata
    const {bookComment} = this.state
    if (expanded) {
      return (
        <div className={classes.listitem}>
          <Tooltip title="remove book">
            <IconButton
              className={classes.button}
              aria-label="Delete"
              onClick={this.onDeleteHandler}>
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

          <Tooltip title="collapse">
            <IconButton
              onClick={this.onExpandHandler}
              className={classes.button}
              aria-label="collapse">
              <RemoveIcon />
            </IconButton>
          </Tooltip>

          <Divider />
          <div className={classes.root}>
            <Divider />
            {/* eslint-disable */}
            {comments.length === 0 ? (
              <div />
            ) : (
              <List component="nav" className={classes.list}>
                {comments.map(item => (
                  <ListItem key={`comment_${uuid.v4()}`}>
                    <ListItemText
                      primary={item.commentText}
                      secondary={`on: ${new Date(item.dateadded)}`}
                      
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {/* eslint-enable */}
            <Divider />
            <div className={classes.container}>
              <TextField
                className={classes.textField}
                helperText="Insert comment"
                value={bookComment}
                onChange={this.onChangeHandler}
              />
              <Tooltip title="Add comment">
                <IconButton
                  className={classes.button}
                  onClick={this.onCommentAdd}
                  aria-label="Add comment">
                  <CommentIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className={classes.listitem}>
        <Tooltip title="remove book">
          <IconButton
            className={classes.button}
            aria-label="Delete"
            onClick={this.onDeleteHandler}>
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

        <Tooltip title="expand">
          <IconButton
            onClick={this.onExpandHandler}
            className={classes.button}
            aria-label="expand">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
    )
  }
}

Book.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line
  bookdata: PropTypes.shape({
    id: PropTypes.string,
    expanded: PropTypes.bool,
    title: PropTypes.string,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        commentText: PropTypes.string,
        dateadded: PropTypes.string
      })
    )
  }),
  AddBookComment: PropTypes.func,
  ShowComments: PropTypes.func,
  DeleteBook: PropTypes.func
}
export default withStyles(styles)(Book)
