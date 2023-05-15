import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import { Navigate } from "react-router-dom";
import { authState } from "~/features/authentication/authSlice";

function PrivateRoutes({ children }) {
  const { accessToken } = useSelector(authState);

  if (!accessToken) {
    return <Navigate to="/sign-in" />;
  }

  return children;
}

PrivateRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoutes;
