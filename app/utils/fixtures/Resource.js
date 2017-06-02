import { Factory } from 'rosie';

const Resource = new Factory()
  .sequence('id', index => `r-${index}`)
  .sequence('name', index => ({ fi: `Resource-${index}` }))
  .sequence('unit', index => `u-${index}`);

export default Resource;
