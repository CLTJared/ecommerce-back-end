const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
router.get('/', async (req, res) => {
  try {
    //Finding all categories and including the product module
    const catSQL = await Category.findAll({
      include: [{
        model: Product,
        required: false, //Left Join, so we get a category even if there is no product.
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      }]
    });
    res.status(200).json(catSQL);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const prodSQL = await Category.findByPk(req.params.id, {
      include: [{
        model: Product,
        required: false,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      }]
    });
    res.status(200).json(prodSQL);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category

  /*
    const jane = await User.create({ firstName: "Jane", lastName: "Doe" });
    console.log("Jane's auto-generated ID:", jane.id);
  */
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;