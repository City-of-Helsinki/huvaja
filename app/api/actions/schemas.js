import { arrayOf, Schema } from 'normalizr';

const cateringProviderSchema = new Schema('cateringProviders');
const equipmentSchema = new Schema('equipment');
const purposeSchema = new Schema('purposes');
const reservationSchema = new Schema('reservations');
const resourceSchema = new Schema('resources');
const typeSchema = new Schema('types');
const unitSchema = new Schema('units');

resourceSchema.define({
  unit: unitSchema,
});

const paginatedCateringProvidersSchema = new Schema('paginatedCateringProviders');
const paginatedEquipmentSchema = new Schema('paginatedEquipment');
const paginatedPurposesSchema = new Schema('paginatedPurposes');
const paginatedReservationsSchema = new Schema('paginatedReservations');
const paginatedResourcesSchema = new Schema('paginatedResources');
const paginatedTypesSchema = new Schema('paginatedTypes');
const paginatedUnitsSchema = new Schema('paginatedUnits');
const typeaheadSchema = new Schema('typeaheadSuggestions');

paginatedCateringProvidersSchema.define({
  results: arrayOf(cateringProviderSchema),
});

paginatedEquipmentSchema.define({
  results: arrayOf(equipmentSchema),
});

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
  paginatedCateringProvidersSchema,
  paginatedEquipmentSchema,
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
