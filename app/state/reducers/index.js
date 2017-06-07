import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { activeRequestsReducer, dataReducer } from 'api/reducers';
import authReducer from 'auth/reducer';
import reservationCateringOrders from './reservationCateringOrdersReducer';
import formPlugins from './formPlugins';
import recurringReservations from './recurringReservationsReducer';
import resourcePage from './resourcePageReducer';
import reservationCancel from './reservationCancelModalReducer';
import reservationInfo from './reservationInfoModalReducer';
import reservationSearchFilters from './reservationSearchFiltersReducer';
import reservationSearchResults from './reservationSearchResultsReducer';
import reservationSuccess from './reservationSuccessModalReducer';
import resourceImages from './resourceImagesModalReducer';
import resourceInfo from './resourceInfoModalReducer';
import resourceSelector from './resourceSelectorReducer';
import resourceSelectorModal from './resourceSelectorModalReducer';
import searchFilters from './searchFiltersReducer';
import searchResults from './searchResultsReducer';

export default combineReducers({
  activeRequests: activeRequestsReducer,
  auth: authReducer,
  reservationCateringOrders,
  data: dataReducer,
  form: formReducer.plugin(formPlugins),
  modals: combineReducers({
    reservationCancel,
    reservationInfo,
    reservationSuccess,
    resourceImages,
    resourceInfo,
    resourceSelector: resourceSelectorModal,
  }),
  recurringReservations,
  reservationSearchPage: combineReducers({
    searchFilters: reservationSearchFilters,
    searchResults: reservationSearchResults,
  }),
  resourcePage,
  resourceSelector,
  searchPage: combineReducers({
    searchFilters,
    searchResults,
  }),
});
