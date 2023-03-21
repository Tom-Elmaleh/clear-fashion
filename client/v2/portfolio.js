// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// I have deployed my api on vercel which works it is on the following link : 
// https://api-eight-virid.vercel.app/.


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
let all_products = []
let Brands_nb = 0;

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts'); // Number of products indicator

const selectBrand = document.querySelector('#brand-select'); // Brand selector
const selectRecent = document.querySelector('#recent-select'); // Recently released selector 
const selectReasonablePrice = document.querySelector('#reasonable-select'); // Reasonable Price selector
const selectSort = document.querySelector('#sort-select'); // Sort selector
const nbBrands = document.querySelector('#nbBrands'); // nbBrands
const RecentProducts = document.querySelector('#RecentProducts'); // Number of recent products indicator
const p90value = document.querySelector('#p90value'); // p90 value indicator
const p50value = document.querySelector('#p50value'); // p50 value indicator
const p95value = document.querySelector('#p95value'); // p95 value indicator
const lastreleased = document.querySelector('#last-released');


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */

const setCurrentProducts = ({result, meta}) => {
  currentProducts = result; 
  if (selectRecent.value=="Yes") // display products that were released less than two weeks ago
  {
    const today = new Date();
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    currentProducts = currentProducts.filter((product) => {
      const releasedDate = new Date(product.released);
      return releasedDate > twoWeeksAgo;
    });
  }

  if(selectBrand.value!=="All") // filter by brand 
  {
    const brandselected = selectBrand.value ;
    currentProducts = currentProducts.filter(product => product.brand === brandselected);
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

const fetchProducts = async (page = 1, size = 12) => {
  try {
    const link = `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`;
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

// function than returns the total number of brands 
const fetchNbBrands = async() => {
  try {
    const link = `https://clear-fashion-api.vercel.app/brands`;
    const response = await fetch(link);   
    const body = await response.json();
    if (body.success !== true) {
      console.error(body);
    } 
  return body.data.result.length
  } 
  catch (error) {
    console.error(error);
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
  // Feature 9 - Number of recent products indicator
  const recentprods = 0;
  const today = new Date();
  const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
  for (let i = 0; i < all_products.length; i++) { 
    const releasedDate = new Date(all_products[i].released);
    if (releasedDate > twoWeeksAgo)
    {
      recentprods +=1;
    }
  }

  // Feature 10 p50,p90 & p95 indicators
  
  // p90 price value indicator
  const prices = all_products.map(product => product.price);
  prices.sort((a, b) => a - b); // we sort the prices
  const index_p90 = Math.floor(prices.length*0.9);
  const value_p90 = prices[index_p90];

  //p50 price value indicator
  const index_p50 = Math.floor(prices.length*0.5);
  const value_p50 = prices[index_p50];

  //p95 price value indicator
  const index_p95 = Math.floor(prices.length*0.95);
  const value_p95 = prices[index_p95];
  spanNbProducts.innerHTML = count;
  RecentProducts.innerHTML = recentprods;
  p90value.innerHTML = value_p90;
  p50value.innerHTML = value_p50;
  p95value.innerHTML = value_p95;

  //Feature 11 : Last released date indicator
  const sortedprods = all_products.sort((productA,productB) => { 
    var dateA = new Date(productA.released);
    var dateB = new Date(productB.released);
    return dateB - dateA;});
  const mostrecent = all_products[0].released;
  lastreleased.innerHTML = mostrecent;
  nbBrands.innerHTML = Brands_nb;
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

const fetchAllProducts = async() => {
  const response = await fetch(`https://clear-fashion-api.vercel.app?page=1&size=222`)
  const body = await response.json()
  return body.data
}

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
  let products = []
  const brandselected = event.target.value;
  if (brandselected !=="All")
  {
    products = await fetchAllProducts();
    setCurrentProducts(products);
  }
  else{
    products = await fetchProducts(1,12);
    setCurrentProducts(products);
  }
  render(currentProducts, currentPagination);
});


/*
  Feature 3 - Filter by recent products
  The function setCurrentProducts was modified so that the feature would work
*/
selectRecent.addEventListener('change', async (event) => {
  let products = []
  const selectrecent = event.target.value;
  if (selectrecent !=="No")
  {
    products = await fetchAllProducts();
    setCurrentProducts(products);
  }
  else{
    products = await fetchProducts(1,12);
    setCurrentProducts(products);
  }
  render(currentProducts,currentPagination);  
});


/*
  Feature 4 - Filter by reasonable price
  The function setCurrentProducts was modified so that the feature would work
*/

selectReasonablePrice.addEventListener('change', async (event) => {
  let products = []
  const reasonableprice = event.target.value;
  if (reasonableprice !=="No")
  {
    products = await fetchAllProducts();
    setCurrentProducts(products);
  }
  else{
    products = await fetchProducts(1,12);
    setCurrentProducts(products);
  }
  render(currentProducts,currentPagination);
});

/*
  Listener for the features related to sorting by date and price (5,6)
*/
selectSort.addEventListener('change', async (event) => {
  let products = []
  const sorttype = event.target.value;
  if (sorttype !=="Unsort")
  {
    products = await fetchAllProducts();
    setCurrentProducts(products);
  }
  else{
    products = await fetchProducts(1,12);
    setCurrentProducts(products);
  }
  render(currentProducts,currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetchAllProducts();
  all_products = res.result;
  Brands_nb = await fetchNbBrands();
  const products = await fetchProducts();
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});