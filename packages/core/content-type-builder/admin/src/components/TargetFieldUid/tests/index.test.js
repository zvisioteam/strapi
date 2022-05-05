/**
 *
 * Tests for TargetFieldUid
 *
 */

import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, lightTheme } from '@strapi/design-system';
import TargetFieldUid from '../index';

describe('<TargetFieldUid />', () => {
  it('renders and matches the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <ThemeProvider theme={lightTheme}>
        <TargetFieldUid />
      </ThemeProvider>
    );

    expect(firstChild).toMatchInlineSnapshot();
  });
});
