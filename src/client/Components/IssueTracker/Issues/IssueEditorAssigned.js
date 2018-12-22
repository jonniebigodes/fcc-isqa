import React from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

const IssueEditorAssigned = props => {
  const {assignedto, changeAssigned} = props
  return (
    <FormControl margin="normal" fullWidth>
      <InputLabel htmlFor="assigned">Issue assigned</InputLabel>
      <Input
        name="assigned"
        id="assigned"
        autoComplete="none"
        value={assignedto}
        onChange={changeAssigned}
      />
    </FormControl>
  )
}
IssueEditorAssigned.propTypes = {
  assignedto: PropTypes.string,
  changeAssigned: PropTypes.func
}
export default IssueEditorAssigned
