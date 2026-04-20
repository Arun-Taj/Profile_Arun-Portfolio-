const createCRUDRouter = require('../middleware/crudRouter');
const { Experience } = require('../models');
module.exports = createCRUDRouter(Experience, { sortBy: { startDate: -1 } });
