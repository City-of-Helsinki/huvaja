import { arrayOf, Schema } from 'normalizr';

function createPaginatedSchema(name) {
  const capitalizedName = name[0].toUpperCase() + name.slice(1);
  const single = new Schema(name);
  const paginated = new Schema(`paginated${capitalizedName}`);
  paginated.define({ results: arrayOf(single) });
  return { paginated, single };
}

const {
  paginated: paginatedPurposesSchema,
  single: purposeSchema,
} = createPaginatedSchema('purposes');

const {
  paginated: paginatedReservationsSchema,
  single: reservationSchema,
} = createPaginatedSchema('reservations');

const {
  paginated: paginatedUnitsSchema,
  single: unitSchema,
} = createPaginatedSchema('units');

const resourceSchema = new Schema('resources');
resourceSchema.define({
  unit: unitSchema,
});
const paginatedResourcesSchema = new Schema('paginatedResources');
paginatedResourcesSchema.define({
  results: arrayOf(resourceSchema),
});

const typeaheadSchema = new Schema('typeaheadSuggestions');
typeaheadSchema.define({
  resource: arrayOf(resourceSchema),
});

export default {
  paginatedCateringOrdersSchema: createPaginatedSchema('cateringOrders').paginated,
  paginatedCateringProductsSchema: createPaginatedSchema('cateringProducts').paginated,
  paginatedCateringProductCategoriesSchema:
    createPaginatedSchema('cateringProductCategories').paginated,
  paginatedCateringProvidersSchema: createPaginatedSchema('cateringProviders').paginated,
  paginatedEquipmentSchema: createPaginatedSchema('equipment').paginated,
  paginatedPurposesSchema,
  paginatedReservationsSchema,
  paginatedResourcesSchema,
  paginatedTypesSchema: createPaginatedSchema('types').paginated,
  paginatedUnitsSchema,
  purposeSchema,
  reservationSchema,
  resourceSchema,
  unitSchema,
};
