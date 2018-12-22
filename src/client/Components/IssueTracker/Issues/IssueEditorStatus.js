import React from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

const IssueEditorStatus = props => {
  const {issuestatustext, changeStatus} = props
  return (
    <FormControl margin="normal" fullWidth>
      <InputLabel htmlFor="statustext">Issue status text</InputLabel>
      <Input
        name="statustext"
        id="statustext"
        autoComplete="none"
        value={issuestatustext}
        onChange={changeStatus}
      />
    </FormControl>
  )
}
IssueEditorStatus.propTypes = {
  issuestatustext: PropTypes.string,
  changeStatus: PropTypes.func
}
export default IssueEditorStatus
