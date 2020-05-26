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
  try {
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
        // order_id: 23,
        server_url: 'https://liqpay-lab.herokuapp.com/api/orders/finished',
        result_url: 'https://liqpay-lab.herokuapp.com/orderHistory.html',
      };

      const form = liqpay.cnb_form(jsonBuy);

      res.json({ form });
    });
  } catch (err) {
    console.error(err);
    // res.status(500).send('Server error');
  }
};

module.exports.finishOrder = async (req, res) => {
  const { data, signature } = req.body;
  const compSignature = liqpay.str_to_sign(private_key + data + private_key);

  try {
    if (signature === compSignature) {
      let buff = Buffer.from(data, 'base64');
      let text = buff.toString('utf-8');
      text = JSON.parse(text);
      console.log(text);

      const {
        status,
        amount,
        currency,
        description,
        order_id,
        product_description,
      } = text;

      // check if order_id exists

      let checkOrder = await Order.findOne({ order_id });

      if (checkOrder) {
        return res.status(400).json({ msg: 'Such an order_id already exists' });
      }

      const newOrder = new Order({
        status,
        amount,
        currency,
        description,
        order_id,
        products: JSON.parse(product_description),
      });

      const order = await newOrder.save();

      res.json({ order });
    }

    res.send('invalid signature');
  } catch (err) {
    console.error(err);
    // res.status(500).send('Server error');
  }
};

module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
