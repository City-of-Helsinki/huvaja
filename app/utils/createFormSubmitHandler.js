import { camelizeKeys } from 'humps';
import mapValues from 'lodash/mapValues';
import { SubmissionError } from 'redux-form';

function getErrors(action) {
  // TODO: Are the errors in action.payload.response?
  if (!action.payload.response) {
    return { _error: `Unknown error: ${action.payload.status}` };
  }
  if (action.payload.response.detail) {
    return { _error: action.payload.response.detail };
  }
  /* eslint-disable camelcase */
  const { non_field_errors, ...errors } = action.payload.response;
  const fieldErrors = camelizeKeys(
    mapValues(errors, error => error.join(' '))
  );
  if (non_field_errors) {
    return { _error: non_field_errors.join(' '), ...fieldErrors };
  }
  /* eslint-enable camelcase */
  return fieldErrors;
}

export default function createFormSubmitHandler(callback) {
  return function handleSubmit(...args) {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    }).catch((action) => {
      throw new SubmissionError(getErrors(action));
    });
    const actionOptions = {
      errorMeta: { sideEffect: reject },
      successMeta: { sideEffect: resolve },
    };
    callback(actionOptions, ...args);
    return promise;
  };
}
