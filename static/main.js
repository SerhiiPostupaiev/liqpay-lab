document.addEventListener('DOMContentLoaded', main);

const data = {
  ids: [],
};

const buyButton = document.getElementById('products-added');

function main() {
  const productsAdded = document.getElementById('products-list-added');
  const checkoutButton = document.getElementById('checkout');

  checkoutButton.addEventListener('click', goToCart);

  const elements = document.querySelectorAll('.modal');
  const instances = M.Modal.init(elements, {
    onOpenStart: () => {
      productsAdded.innerHTML = '';
      if (data.ids.length) {
        fetchAddedProducts();
      } else {
        productsAdded.innerHTML = 'No items added';
        buyButton.innerHTML = `<button id="products-buy" class="btn waves-effect waves-light disabled" type="submit" name="btn_text" >Buy
          <i class="material-icons right">send</i>
        </button>`;
      }
    },
  });

  fetchProducts();
  // goToCheckout();
}

async function fetchProducts() {
  const response = await fetch('/api/products');
  const products = await response.json();

  const list = document.getElementById('products-list');

  for (item of products) {
    const li = document.createElement('li');
    li.classList.add('collection-item');
    li.setAttribute('data-id', item._id.toString());

    const div = document.createElement('div');
    div.innerText = `${item.name}, Price: ${item.price}${item.currency}`;

    const a = document.createElement('a');
    a.classList.add('secondary-content');
    a.classList.add('buy');
    a.setAttribute('href', '#!');
    li.setAttribute('data-id', item._id.toString());

    const i = document.createElement('i');
    i.classList.add('material-icons');
    i.innerText = 'add';
    i.addEventListener('click', markProduct);

    a.appendChild(i);
    div.appendChild(a);
    li.appendChild(div);

    list.appendChild(li);
  }
}

function markProduct(e) {
  if (e !== null) {
    const element = e.target;
    const parent = element.parentElement.parentElement.parentElement;
    if (parent.classList.contains('selected')) {
      parent.classList.remove('selected');
      parent.classList.remove('teal');
      parent.classList.remove('darken-2');
      element.innerText = 'add';
      data.ids = data.ids.filter((id) => id !== parent.getAttribute('data-id'));
    } else {
      parent.classList.add('selected');
      parent.classList.add('teal');
      parent.classList.add('darken-2');
      element.innerText = 'remove';
      data.ids = [...data.ids, parent.getAttribute('data-id')];
    }
  }
}

async function fetchAddedProducts() {
  if (data.ids.length) {
    const response = await fetch('/api/products/added', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const { products } = await response.json();

    const list = document.getElementById('products-list-added');

    for (item of products) {
      const li = document.createElement('li');
      li.classList.add('collection-item');

      const div = document.createElement('div');
      div.innerText = `${item.name}, Price: ${item.price}${item.currency}`;

      li.appendChild(div);

      list.appendChild(li);
    }
  }
}

async function goToCart() {
  if (data.ids.length) {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const { form } = await response.json();

    buyButton.innerHTML = form.replace(
      '<input type="image" src="//static.liqpay.ua/buttons/p1ru.radius.png" name="btn_text" />',
      `<button id="products-buy" src="" class="btn waves-effect waves-light" type="submit" name="btn_text" >Buy
        <i class="material-icons right">send</i>
      </button>`
    );
  }
}
