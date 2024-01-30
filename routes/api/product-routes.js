const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const prodSQL = await Product.findAll({ // find all in Product model
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      include: [{
        model: Category, //Include Category model
        required: true, //INNER JOIN
      },
    {
      model: Tag, //Include Tag model
      required: true, //INNER JOIN
    }]
    });
    res.status(200).json(prodSQL);
  } catch (err) {
    res.status(500).json(err);
  }

});

// get one product
router.get('/:id', async (req, res) => {
  // Find a single product by PrimaryKey
  try {
    const prodSQL = await Product.findByPk(req.params.id, {
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'], // Include these columns from database
      include: [{
        model: Category, //Including Category model
        required: true, //INNER JOIN
      },
      {
        model: Tag, //Including Tag model
        required: true, //INNER Join
      }
    ]
    });
    res.status(200).json(prodSQL);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const prodSQL = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    //Test if we send 400/Invalid or 200/Information
    prodSQL==0 ? res.status(400).json({"status": "Invalid User Input."}) : res.status(200).json(prodSQL);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;