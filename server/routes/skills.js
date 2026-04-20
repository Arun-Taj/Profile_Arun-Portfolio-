const createCRUDRouter = require('../middleware/crudRouter');
const { Skill } = require('../models');
module.exports = createCRUDRouter(Skill, { sortBy: { category: 1, order: 1 } });
