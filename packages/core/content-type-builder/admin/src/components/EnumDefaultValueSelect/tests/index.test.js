/**
 *
 * Tests for DefaultEnum
 *
 */

import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, lightTheme } from '@strapi/design-system';
import DefaultEnum from '../index';

describe('<DefaultEnum />', () => {
  it('renders and matches the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <ThemeProvider theme={lightTheme}>
        <DefaultEnum />
      </ThemeProvider>
    );

    expect(firstChild).toMatchInlineSnapshot();
  });
});
