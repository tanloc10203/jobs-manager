import React, { useState } from "react";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import { InputAdornment, TextField, IconButton } from "@mui/material";
import Iconify from "~/components/Iconify";

function InputField(props) {
  const { name, control, label, type, ...inputProps } = props;

  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({ name, control });

  const [showPwd, setShowPwd] = useState(false);

  const handleShowPassword = () => {
    setShowPwd((show) => !show);
  };

  return (
    <TextField
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ref}
      value={value}
      name={name}
      label={label}
      type={type === "password" ? (showPwd ? "text" : "password") : type}
      error={invalid}
      helperText={error?.message}
      inputProps={inputProps}
      variant="outlined"
      margin="normal"
      fullWidth
      InputProps={{
        endAdornment:
          type === "password" ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleShowPassword}
                edge="end"
              >
                <Iconify icon={showPwd ? "eva:eye-fill" : "eva:eye-off-fill"} />
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
    />
  );
}

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
};

export default InputField;
