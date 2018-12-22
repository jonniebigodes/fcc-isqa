import React from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

const IssueEditorTitle = props => {
  const {title, changeTitle} = props
  return (
    <FormControl margin="normal" required fullWidth>
      <InputLabel htmlFor="title">Issue Title</InputLabel>
      <Input
        id="title"
        name="title"
        autoComplete="none"
        autoFocus
        value={title}
        onChange={changeTitle}
      />
    </FormControl>
  )
}
IssueEditorTitle.propTypes = {
  title: PropTypes.string,
  changeTitle: PropTypes.func
}
export default IssueEditorTitle
