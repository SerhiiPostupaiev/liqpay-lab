const Liqpay = require('../liqpay');
const Product = require('../models/Product');
const Order = require('../models/Order');
const keys = require('../configs/liqPayConf.json');

const public_key = keys.public_key;
const private_key = keys.private_key;

const liqpay = new Liqpay(public_key, private_key);

module.exports.prepareOrders = async (req, res) => {
  const { ids } = req.body;

  if (!ids.length) {
    return res.status(404).send('Empty');
  }
  await Product.find({ _id: { $in: ids } }, (err, products) => {
    const prodList = JSON.stringify(products);

    const amount = products.reduce(
      (total, productItem) => total + +productItem.price,
      0
    );

    const description = products
      .reduce(
        (total, productItem) =>
          `${total}, ` + `${productItem.name}: ${productItem.price}UAH`,
        ''
      )
      .slice(2);

    const jsonBuy = {
      public_key,
      version: '3',
      action: 'pay',
      amount,
      currency: 'UAH',
      description: 'Items to buy - ' + description,
      product_description: prodList,
      order_id: Date.now(),
      server_url: 'https://liqpay-lab.herokuapp.com/api/orders/finished',
    };

    const form = liqpay.cnb_form(jsonBuy);

    res.json({ form });
  });
};

module.exports.finishOrder = async (req, res) => {
  const { data, signature } = req.body;
  const compSignature = liqpay.str_to_sign(private_key + data + private_key);

  try {
    if (signature === compSignature) {
      // dec
    }

    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

function b64DecodeUnicode(str) {
  const decodedString = decodeURIComponent(
    atob(str)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(decodedString);
}
