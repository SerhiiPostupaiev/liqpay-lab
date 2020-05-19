const Product = require('../models/Product');

module.exports.createProduct = async (req, res) => {
  const { name, price, currency } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      currency,
    });

    const product = await newProduct.save();

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const product = await Product.find();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports.getAddedProducts = async (req, res) => {
  const { ids } = req.body;

  if (!ids.length) {
    return res.status(404).send('Empty');
  }
  Product.find({ _id: { $in: ids } }, (err, products) =>
    res.json({ products })
  );
};
