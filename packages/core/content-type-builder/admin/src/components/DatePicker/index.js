/**
 *
 * DatePicker
 *
 */

import React, { useMemo } from 'react';
import { GenericInput } from '@strapi/helper-plugin';
import { useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import makeSelectFormModal from '../FormModal/selectors';

const DatePicker = ({ intlLabel, name, onChange, value }) => {
  const formModalSelector = useMemo(makeSelectFormModal, []);
  const reducerState = useSelector(state => formModalSelector(state), shallowEqual);

  const {
    modifiedData: { type },
  } = reducerState;

  return (
    <GenericInput
      disabled={!type}
      intlLabel={intlLabel}
      name={name}
      onChange={onChange}
      value={value}
      type={type || 'date'}
    />
  );
};

DatePicker.defaultProps = {
  value: null,
};

DatePicker.propTypes = {
  intlLabel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object,
  }).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default DatePicker;
