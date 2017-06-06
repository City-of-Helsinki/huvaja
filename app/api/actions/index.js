import {
  fetchCateringProducts,
  fetchCateringProductCategories,
  fetchCateringProviders,
} from './catering';
import { createComment, fetchComments } from './comments';
import { fetchEquipment } from './equipment';
import {
  fetchReservationDetailsReport,
  fetchResourceDailyReport,
} from './reports';
import {
  cancelReservation,
  editReservation,
  fetchReservation,
  fetchReservations,
  makeReservation,
} from './reservations';
import {
  favoriteResource,
  fetchFavoritedResources,
  fetchResource,
  fetchResources,
  unfavoriteResource,
} from './resources';
import { fetchTypes } from './types';
import { fetchUnits } from './units';

export {
  cancelReservation,
  createComment,
  editReservation,
  favoriteResource,
  fetchCateringProducts,
  fetchCateringProductCategories,
  fetchCateringProviders,
  fetchComments,
  fetchEquipment,
  fetchFavoritedResources,
  fetchReservationDetailsReport,
  fetchResourceDailyReport,
  fetchReservation,
  fetchReservations,
  fetchResource,
  fetchResources,
  fetchTypes,
  fetchUnits,
  makeReservation,
  unfavoriteResource,
};
