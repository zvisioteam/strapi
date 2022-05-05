/**
 *
 * DefaultEnum
 *
 */

import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { GenericInput } from '@strapi/helper-plugin';
import { useSelector, shallowEqual } from 'react-redux';
import makeSelectFormModal from '../FormModal/selectors';

const EnumDefaultValueSelect = ({ name, onChange, value, intlLabel }) => {
  const formModalSelector = useMemo(makeSelectFormModal, []);
  const reducerState = useSelector(state => formModalSelector(state), shallowEqual);
  const enumeration = reducerState.modifiedData.enum;

  const options = [
    {
      key: '__null_reset_value__',
      value: '',
      metadatas: {
        intlLabel: {
          id: 'components.InputSelect.option.placeholder',
          defaultMessage: 'Choose here',
        },
      },
    },
    ...(enumeration || [])
      .filter((value, index) => enumeration.indexOf(value) === index && value)
      .map(value => {
        return {
          key: value,
          value,
          metadatas: {
            intlLabel: { id: `${value}.no-override`, defaultMessage: value },
          },
        };
      }),
  ];

  return (
    <GenericInput
      name={name}
      type="select"
      intlLabel={intlLabel}
      onChange={onChange}
      value={value || ''}
      options={options}
    />
  );
};

EnumDefaultValueSelect.defaultProps = {
  value: null,
};

EnumDefaultValueSelect.propTypes = {
  intlLabel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object,
  }).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};
export default EnumDefaultValueSelect;
