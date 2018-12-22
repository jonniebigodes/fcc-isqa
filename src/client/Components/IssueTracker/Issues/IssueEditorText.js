import React from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

const IssueEditorText = props => {
  const {changeIssueText, textissue} = props
  return (
    <FormControl margin="normal" required fullWidth>
      <InputLabel htmlFor="issuetext">Issue Text</InputLabel>
      <Input
        name="issuetext"
        id="issuetext"
        autoComplete="none"
        value={textissue}
        onChange={changeIssueText}
      />
    </FormControl>
  )
}
IssueEditorText.propTypes = {
  textissue: PropTypes.string,
  changeIssueText: PropTypes.func
}
export default IssueEditorText
