const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
router.get('/', async (req, res) => {
  try {
    const prodSQL = await Tag.findAll({ // FindAll from `Tag` model
      include: [{
        model: Product, // Include associated data from `Product` model
        attributes: ['product_name', 'price', 'stock', 'category_id']
      }]
    });
    res.status(200).json(prodSQL);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.get('/:id', async (req, res) => {
  try {
    const prodSQL = await Tag.findByPk(req.params.id, {
      include: [{
        model: Product,
        attributes: ['product_name', 'price', 'stock', 'category_id']
      }]
    });
    res.status(200).json(prodSQL);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
