import React from 'react';
import PropTypes from 'prop-types';

import styles from './Button.style.css';

export default function Button({ label, ...rest }) {
  return (
    <div className={styles.primaryButton} {...rest}>
      {label}
    </div>
  );
}

Button.propTypes = {
  label: PropTypes.string,
};
