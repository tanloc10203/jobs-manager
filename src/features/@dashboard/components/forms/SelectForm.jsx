import React, { memo } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { getSlug } from "~/utils";

function SelectForm({
  children,
  label,
  error,
  helperText,
  onChange,
  sx,
  ...others
}) {
  return (
    <FormControl fullWidth sx={{ ...sx }} margin="normal" error={error}>
      <InputLabel id={getSlug(label)}>{label}</InputLabel>

      <Select
        labelId={getSlug(label)}
        id={getSlug(label)}
        {...others}
        label={label}
        onChange={onChange}
      >
        <MenuItem disabled value="">
          <em>Vui lòng chọn</em>
        </MenuItem>
        {children}
      </Select>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

SelectForm.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  onChange: PropTypes.func,
};

export default memo(SelectForm);
