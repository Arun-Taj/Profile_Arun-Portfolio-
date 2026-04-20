const express = require('express');
const { protect } = require('../middleware/auth');

const createCRUDRouter = (Model, options = {}) => {
  const router = express.Router();
  const { publicFilter = {}, sortBy = { order: 1, createdAt: -1 } } = options;

  router.get('/', async (req, res) => {
    try {
      const items = await Model.find(publicFilter).sort(sortBy);
      res.json(items);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.get('/:id', async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.post('/', protect, async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json(item);
    } catch (err) { res.status(400).json({ error: err.message }); }
  });

  router.put('/:id', protect, async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) { res.status(400).json({ error: err.message }); }
  });

  router.delete('/:id', protect, async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  return router;
};

module.exports = createCRUDRouter;
