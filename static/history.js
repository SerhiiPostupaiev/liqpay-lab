window.addEventListener('DOMContentLoaded', loadHistory);

async function loadHistory() {
  const orderList = document.getElementById('list');

  const response = await fetch('/api/orders');
  let ordersData = await response.json();

  ordersData = ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (ordersData.length === 0) {
    orderList.textContent = 'No orders';
    return;
  }

  for (order of ordersData) {
    const orderItem = document.createElement('li');
    orderItem.classList.add('orders-list__item');
    orderItem.classList.add('order');

    const dateBlock = document.createElement('div');
    dateBlock.classList.add('order__order-info');
    dateBlock.classList.add('order-info');

    const date = document.createElement('span');
    date.textContent = formDate(order.date);
    date.classList.add('order-info__date');
    dateBlock.append(date);

    const status = document.createElement('span');
    status.textContent = order.status;
    status.classList.add('order-info__status');
    defineStatus(status, order.status);
    dateBlock.append(status);
    orderItem.append(dateBlock);

    const amount = document.createElement('div');
    amount.textContent = `Price: ${order.amount} ${order.currency}`;
    amount.classList.add('order__price');
    orderItem.append(amount);
    const itemsCaption = document.createElement('h3');
    itemsCaption.classList.add('order__caption');
    itemsCaption.textContent = 'Items: ';
    orderItem.append(itemsCaption);

    const products = formProducts(order.products);
    orderItem.append(products);

    orderList.append(orderItem);
  }
}

function defineStatus(statusBlock, status) {
  if (order.status === 'success') {
    statusBlock.classList.add('order-info__status_success');
  } else {
    statusBlock.classList.add('order-info__status_fail');
  }
}

function formProducts(products) {
  const productsList = document.createElement('ul');
  productsList.classList.add('order__products');
  productsList.classList.add('products');

  for (item of products) {
    const productItem = document.createElement('li');
    productItem.textContent = `${item.name} - ${item.price} ${item.currency}`;
    productItem.classList.add('products__item');

    productsList.append(productItem);
  }

  return productsList;
}

function formDate(dateStr) {
  const monthName = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date(dateStr);

  const hours = date.getHours().toString();
  const minutes = date.getMinutes().toString();

  return `${date.getDate()} ${monthName[date.getMonth()].substring(
    0,
    3
  )}, ${date.getFullYear()} | ${hours.length === 1 ? '0' + hours : hours} : ${
    minutes.length === 1 ? '0' + minutes : minutes
  }`;
}
