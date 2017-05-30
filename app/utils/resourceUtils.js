function getLongName(resource, unit) {
  if (!(resource && resource.name.fi && unit && unit.name.fi)) return null;
  return `${unit.name.fi} / ${resource.name.fi}`;
}

export default {
  getLongName,
};
