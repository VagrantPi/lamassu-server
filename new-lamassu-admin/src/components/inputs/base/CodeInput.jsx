import { makeStyles } from '@material-ui/core'
import classnames from 'classnames'
import React from 'react'
import OtpInput from 'react-otp-input'

import typographyStyles from 'src/components/typography/styles'

import styles from './CodeInput.styles'

const useStyles = makeStyles(styles)
const useTypographyStyles = makeStyles(typographyStyles)

const CodeInput = ({
  name,
  value,
  onChange,
  numInputs,
  error,
  inputStyle,
  containerStyle
}) => {
  const classes = useStyles()
  const typographyClasses = useTypographyStyles()

  return (
    <OtpInput
      id={name}
      value={value}
      onChange={onChange}
      numInputs={numInputs}
      renderSeparator={<span> </span>}
      shouldAutoFocus
      containerStyle={classnames(containerStyle, classes.container)}
      inputStyle={classnames(
        inputStyle,
        classes.input,
        typographyClasses.confirmationCode,
        error && classes.error
      )}
      inputType={'tel'}
      renderInput={(props) => (
        <input
          {...props}
        />
      )}
    />
  )
}

export default CodeInput
