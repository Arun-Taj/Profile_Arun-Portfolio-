const createCRUDRouter = require('../middleware/crudRouter');
const { Education } = require('../models');
module.exports = createCRUDRouter(Education, { sortBy: { startDate: -1 } });
