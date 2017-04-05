import { arrayOf, Schema } from 'normalizr';

const purposeSchema = new Schema('purposes');
const reservationSchema = new Schema('reservations');
const resourceSchema = new Schema('resources');
const typeSchema = new Schema('types');
const unitSchema = new Schema('units');

resourceSchema.define({
  unit: unitSchema,
});

const paginatedPurposesSchema = new Schema('paginatedPurposes');
const paginatedReservationsSchema = new Schema('paginatedReservations');
const paginatedResourcesSchema = new Schema('paginatedResources');
const paginatedTypesSchema = new Schema('paginatedTypes');
const paginatedUnitsSchema = new Schema('paginatedUnits');
const typeaheadSchema = new Schema('typeaheadSuggestions');

paginatedPurposesSchema.define({
  results: arrayOf(purposeSchema),
});

paginatedReservationsSchema.define({
  results: arrayOf(reservationSchema),
});

paginatedResourcesSchema.define({
  results: arrayOf(resourceSchema),
});

paginatedTypesSchema.define({
  results: arrayOf(typeSchema),
});

paginatedUnitsSchema.define({
  results: arrayOf(unitSchema),
});

typeaheadSchema.define({
  resource: arrayOf(resourceSchema),
});

export default {
  paginatedPurposesSchema,
  paginatedReservationsSchema,
  paginatedResourcesSchema,
  paginatedTypesSchema,
  paginatedUnitsSchema,
  purposeSchema,
  reservationSchema,
  resourceSchema,
  unitSchema,
};
