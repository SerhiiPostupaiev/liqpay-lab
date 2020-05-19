require('dotenv').config();

const express = require('express');
const allowCrossDomain = require('./src/middleware/cors');
const connectDB = require('./src/db/dbService');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  express.json({
    extended: false,
  })
);
app.use(allowCrossDomain);

app.use(express.static(__dirname + '/static'));

app.use('/api/products', require('./src/routes/products'));
app.use('/api/orders', require('./src/routes/orders'));

function runServer() {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

async function main() {
  await connectDB();
  runServer();
}

main();