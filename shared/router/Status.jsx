import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';

export default function Status({ code, children }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.status = code;
        }
        return children;
      }}
    />
  );
}

Status.propTypes = {
  code: PropTypes.number.isRequired,
};
