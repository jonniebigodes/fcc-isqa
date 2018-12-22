import React from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

const IssueEditorCreator = props => {
  const {creatorissue, changeCreator} = props
  return (
    <FormControl margin="normal" required fullWidth>
      <InputLabel htmlFor="creator">Issue Creator</InputLabel>
      <Input
        name="creator"
        id="creator"
        autoComplete="none"
        value={creatorissue}
        onChange={changeCreator}
      />
    </FormControl>
  )
}
IssueEditorCreator.propTypes = {
  changeCreator: PropTypes.func,
  creatorissue: PropTypes.string
}
export default IssueEditorCreator
