const createCRUDRouter = require('../middleware/crudRouter');
const { Testimonial } = require('../models');
module.exports = createCRUDRouter(Testimonial, { publicFilter: { approved: true }, sortBy: { featured: -1, createdAt: -1 } });
