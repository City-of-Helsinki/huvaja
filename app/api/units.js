import { CALL_API } from 'redux-api-middleware';

import types from './actionTypes';
import schemas from './schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from './utils';

function fetchUnits() {
  const fetchParams = { pageSize: 100 };

  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.UNITS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.UNITS_GET_SUCCESS,
          { schema: schemas.paginatedUnitsSchema }
        ),
        getErrorTypeDescriptor(types.UNITS_GET_ERROR),
      ],
      endpoint: buildAPIUrl('unit', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

export {
  fetchUnits,  // eslint-disable-line import/prefer-default-export
};
