import { arrayOf, Schema } from 'normalizr';

const equipmentSchema = new Schema('equipment');
const purposeSchema = new Schema('purposes');
const reservationSchema = new Schema('reservations');
const resourceSchema = new Schema('resources');
const typeSchema = new Schema('types');
const unitSchema = new Schema('units');

resourceSchema.define({
  unit: unitSchema,
});

const paginatedEquipmentSchema = new Schema('paginatedEquipment');
const paginatedPurposesSchema = new Schema('paginatedPurposes');
const paginatedReservationsSchema = new Schema('paginatedReservations');
const paginatedResourcesSchema = new Schema('paginatedResources');
const paginatedTypesSchema = new Schema('paginatedTypes');
const paginatedUnitsSchema = new Schema('paginatedUnits');
const typeaheadSchema = new Schema('typeaheadSuggestions');

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
