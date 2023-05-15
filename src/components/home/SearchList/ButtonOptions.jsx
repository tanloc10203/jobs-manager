import React from "react";
import PropTypes from "prop-types";
import "./ButtonOptions.css";

function ButtonOptions({ name, onClickFunc, label, disabled, number }) {
  return (
    <div className="optionItem">
      <span className="optionText">{name}</span>
      <div className="optionCounter">
        <button
          disabled={disabled}
          className="optionCounterButton"
          onClick={() => onClickFunc(label, "d")}
        >
          -
        </button>
        <span className="optionCounterNumber">{number}</span>
        <button
          className="optionCounterButton"
          onClick={() => onClickFunc(label, "i")}
        >
          +
        </button>
      </div>
    </div>
  );
}

ButtonOptions.propTypes = {
  name: PropTypes.string.isRequired,
  onClickFunc: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
};

export default ButtonOptions;
