// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/


// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

const selectBrand = document.querySelector('#brand-select'); // Brand selector
const selectRecent = document.querySelector('#recent-select'); // Recently released selector 
const selectReasonablePrice = document.querySelector('#reasonable-select'); // Reasonable Price selector
const selectSort = document.querySelector('#sort-select'); // Sort selector
const nbBrands = document.querySelector('#nbBrands');

let currentBrand = "All";

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */

const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  // The part below ables to deal display products that were released less than two weeks ago 
  if (selectRecent.value=="Yes")
  {
    const today = new Date();
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    currentProducts = currentProducts.filter((product) => {
      const releasedDate = new Date(product.released);
      return releasedDate > twoWeeksAgo;
    });
  }

  if(selectReasonablePrice.value=="Yes") // filter by reasonable price
  {
    currentProducts = currentProducts.filter(products => products.price<=50);
  }

  if(selectSort.value=="price-asc") // sort by cheapest products
  { 
    currentProducts =currentProducts.sort((product1,product2) => product1.price - product2.price);
  }
  
  if(selectSort.value=="price-desc") // sort by expensive products
  {
    currentProducts = currentProducts.sort((product1,product2) => product2.price - product1.price);
  }

  if(selectSort.value=="date-asc") // sort by anciently released (old to recent)
  {
    currentProducts = currentProducts.sort((productA,productB) => { 
      var dateA = new Date(productA.released);
      var dateB = new Date(productB.released);
      return dateA - dateB;});
  }

  if(selectSort.value=="date-desc") // sort by recently released (recent to old)
  {
    currentProducts = currentProducts.sort((productA,productB) => { 
      var dateA = new Date(productA.released);
      var dateB = new Date(productB.released);
      return dateB - dateA;});
  }
  currentPagination = meta;
};


/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 * 
 */

const fetchProducts = async (page = 1, size = 12,brand='All') => {
  try {
    let link = `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`;

   // Condition that ables to retrieve all products from a specific brand
    if (brand !== "All") {
      currentBrand = brand;
      link += `&brand=${brand}`; // we add the value of the selector to the link
    }
    const response = await fetch(link);   
    const body = await response.json();
    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }     
  return body.data;
  } 
  catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


/**
 * Render list of products
 * @param  {Array} products
 */

const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}" target="_blank">${product.name}</a>           
        <span>${product.price}</span>
      </div>
    `; // we add the attribute target ="_blank" so that when a user clicks on a product link, it is opened in a new page (Feature 12)
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};


/**
 * Render page selector
 * @param  {Object} pagination
 */

const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */

selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/*
  Feature 1 - Browse pages
  Select the number of the page
*/
selectPage.addEventListener('change', async (event) => {
  // the first parameter corresponds to the currentPage value (indicated by the selector value) 
  // and the second indicates the pageCount of the currentPage 
  const products = await fetchProducts(parseInt(event.target.value),currentPagination.pageSize);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


/*
  Feature 2 - Filter by brands name
*/
selectBrand.addEventListener('change', async (event) => {
  console.log(currentPagination);
  const products = await fetchProducts(currentPagination.currentPage,currentPagination.pageSize,event.target.value);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/*
  Feature 3 - Filter by recent products
  The function setCurrentProducts was modified so that the feature would work
*/
selectRecent.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize); 
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/*
  Feature 4 - Filter by reasonable price
  The function setCurrentProducts was modified so that the feature would work
*/
selectReasonablePrice.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize); 
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectSort.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize); 
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


