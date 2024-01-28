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
  // FindByPK, using Primary Key to search
  try {
    const catSQL = await Category.findByPk(req.params.id, {
      include: [{
        model: Product, // Include Product model
        required: false,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'], // Include only these columns from database
      }]
    });
    res.status(200).json(catSQL);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const [name, created] = await Category.findOrCreate({ //Utilizing findOrCreate instead of Create so that we can determine if the category_name already exist and return
      where: {
        "category_name": req.body.category_name
      }
    })
    created ? res.status(200).json(name) : res.status(400).json({"status": "Invalid Input."})
  } catch (err) {
    res.status(500).json(err)
  }

});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const catSQL = await Category.update({category_name: req.body.category_name} ,{
      where: {
        id: req.params.id
      }
    });
    //Test if we send 400/No ID found or 200/Information
    catSQL==0 ? res.status(400).json({"status": "No ID found."}) : res.status(200).json(catSQL);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const catSQL = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    //Test if we send 404/No ID found or 200/Information
    catSQL==0 ? res.status(400).json({"status": "No ID found."}) : res.status(200).json(catSQL);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;