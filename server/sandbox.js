/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await dedicatedbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

// sandbox(eshop);

const fs = require('fs');
const path = require('path');

async function Test() {
  const jsonPath = path.join(__dirname, 'brands.json'); // make sure to specify the full path to the file
  const jsonData = await fs.promises.readFile(jsonPath, 'utf-8');
  const brands = JSON.parse(jsonData);
  console.log(brands);
}

Test()
