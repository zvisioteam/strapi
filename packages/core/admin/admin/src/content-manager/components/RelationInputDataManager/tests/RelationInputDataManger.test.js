import React from 'react';
import { IntlProvider } from 'react-intl';
import { render } from '@testing-library/react';
import { ThemeProvider, lightTheme } from '@strapi/design-system';
import { QueryClientProvider, QueryClient } from 'react-query';

import { RelationInputDataManager } from '..';
import { RelationInput as inputSpy } from '../../RelationInput';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

jest.mock('../../RelationInput', () => ({
  RelationInput: jest.fn().mockReturnValue(null),
}));

jest.mock('@strapi/helper-plugin', () => ({
  ...jest.requireActual('@strapi/helper-plugin'),
  useCMEditViewDataManager: jest.fn().mockImplementation(() => ({
    isCreatingEntry: true,
    createActionAllowedFields: ['relation'],
    readActionAllowedFields: ['relation'],
    updateActionAllowedFields: ['relation'],
    slug: 'test',
    initialData: {},
  })),
}));

const setup = (props) =>
  render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <IntlProvider locale="en">
          <RelationInputDataManager
            intlLabel={{
              id: 'label',
              defaultMessage: 'Label',
            }}
            isCreatingEntry
            isFieldReadable
            mainField={{
              name: 'relation',
              schema: {
                type: 'relation',
              },
            }}
            name="relation"
            relationType="oneToOne"
            size={6}
            targetModel="something"
            queryInfos={{
              defaultParams: {},
              endpoints: {
                relation: '/relation',
                search: '/search',
              },
              shouldDisplayRelationLink: false,
            }}
            {...props}
          />
        </IntlProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );

describe('RelationInputDataManager', () => {
  test('blabla', () => {
    setup();

    expect(inputSpy).toBeCalledWith(
      expect.objectContaining({
        relation: expect.objectContaining({
          data: [],
        }),
      })
    );
  });
});
