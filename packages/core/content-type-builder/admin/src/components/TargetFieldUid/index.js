/**
 *
 * TargetFieldUid
 *
 */
import React from 'react';
import { GenericInput } from '@strapi/helper-plugin';
import PropTypes from 'prop-types';
import useDataManager from '../../hooks/useDataManager';

const TargetFieldUid = ({ intlLabel, name, onChange, value }) => {
  const { modifiedData } = useDataManager();

  const options = modifiedData.contentType.schema.attributes
    .filter(({ type }) => ['string', 'text'].includes(type))
    .map(({ name }) => ({
      key: name,
      value: name,
      metadatas: {
        intlLabel: { id: `${name}.no-override`, defaultMessage: name },
      },
    }));

  return (
    <GenericInput
      intlLabel={intlLabel}
      name={name}
      onChange={(event) => {
        onChange(event);

        if (event.target.value) {
          onChange({ target: { name: 'default', value: null } });
        }
      }}
      value={value || ''}
      type="select"
      options={[
        {
          key: '__null_reset_value__',
          value: '',
          metadatas: { intlLabel: { id: 'global.none', defaultMessage: 'None' } },
        },
        ...options,
      ]}
    />
  );
};

TargetFieldUid.defaultProps = {
  value: null,
};

TargetFieldUid.propTypes = {
  intlLabel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object,
  }).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default TargetFieldUid;
