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

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagSQL = await Tag.create({
      tag_name: req.body.tag_name
    })
    //Test if we are sending back 400/Invalid or 200/Information
    tagSQL==0 ? res.status(400).json({"status": "Invalid User Input."}) : res.status(200).json(tagSQL);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagSQL = await Tag.update({tag_name: req.body.tag_name}, {
      where: {
        id: req.params.id
      }
    });
    //Test if we are sending back 400/Invalid or 200/Information
    tagSQL==0 ? res.status(400).json({"status": "Invalid User Input."}) : res.status(200).json(tagSQL);

    } catch (err) {
      res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagSQL = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    //Test if we are sending back 400/Invalid or 200/Information
    tagSQL==0 ? res.status(400).json({"status": "Invalid User Input."}) : res.status(200).json(tagSQL);
    
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
