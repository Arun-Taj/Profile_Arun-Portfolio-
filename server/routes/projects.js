const createCRUDRouter = require('../middleware/crudRouter');
const { Project } = require('../models');
module.exports = createCRUDRouter(Project, { sortBy: { featured: -1, order: 1, createdAt: -1 } });
