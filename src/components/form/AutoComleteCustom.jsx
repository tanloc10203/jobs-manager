import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { Autocomplete, TextField } from "@mui/material";

function AutoComleteCustom({
  inputValue = "",
  options,
  getOptionLabel,
  isOptionEqualToValue,
  defaultValue = "",
  onChange,
  getOptionDisabled,
  onInputChange,
  ...props
}) {
  const handleOnChangeInput = useCallback(
    (event, value, reason) => {
      if (reason === "reset" || !onInputChange) return;
      onInputChange(value);
    },
    [onInputChange]
  );

  const handleOnChange = useCallback(
    (event, value) => {
      if (!value || !onChange) return;
      onChange(value);
    },
    [onChange]
  );

  return (
    <Autocomplete
      sx={{
        minWidth: {
          md: 200,
        },
      }}
      disablePortal
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      onChange={handleOnChange}
      onInputChange={handleOnChangeInput}
      getOptionDisabled={getOptionDisabled}
      defaultValue={defaultValue}
      inputValue={inputValue || ""}
      renderInput={(params) => (
        <TextField
          {...params}
          {...props}
          fullWidth
          InputProps={{
            ...params.InputProps,
            readOnly: true,
          }}
        />
      )}
    />
  );
}

AutoComleteCustom.propTypes = {
  inputValue: PropTypes.string,
  options: PropTypes.array,
  getOptionLabel: PropTypes.func,
  isOptionEqualToValue: PropTypes.func,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
  getOptionDisabled: PropTypes.func,
};

export default memo(AutoComleteCustom);
