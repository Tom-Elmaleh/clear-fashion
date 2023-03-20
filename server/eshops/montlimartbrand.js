const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */

// Function to generate a random date within one month
function GenerateRandomDate() {
  const right_now = new Date();
  const oneMonthAgo = new Date(right_now.getTime() - 30 * 24 * 60 * 60 * 1000); // one month ago date
  const random_timestamp = Math.floor(Math.random() * (right_now.getTime() - oneMonthAgo.getTime())) + oneMonthAgo.getTime(); 
  const randomDate = new Date(random_timestamp);
  return randomDate.toLocaleDateString('en-US');
}

const parse = data => {
  const $ = cheerio.load(data);
  return $('.products-list .products-list__block.products-list__block--grid')
    .map((i, element) => {
      const name = $(element)
        .find('.text-reset')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );
      const brand = "montlimar";
      const date = GenerateRandomDate();
      return {name,brand,price,date};
    })
    .get();
};


/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};