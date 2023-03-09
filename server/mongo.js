const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://tom:mongoCluster@cluster.wlasw6t.mongodb.net/?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';

async function ClientConnect() {
  const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
  const db = client.db(MONGODB_DB_NAME);
  console.log('Connected to MongoDB successfully!');
  //   const products = [];
  //   const collection = db.collection('products');
  //   const result = collection.insertMany(products);
  //   console.log(result);  
  // Perform any database operations here...
  client.close();
  console.log('Disconnected from MongoDB successfully!');
}

ClientConnect();


// Find all products sorted by date
// Find all products scraped less than 2 weeks

// Find all products related to a given brands
async function Product_Brand(brand) {
    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
    const db = client.db(MONGODB_DB_NAME);
    console.log('Connected to MongoDB successfully!');
    const collection = db.collection('products');
    const products_brand = await collection.find({brand}).toArray();
    console.log(products_brand);  
    client.close();
    console.log('Disconnected from MongoDB successfully!');
  }

//  Find all products less than a price
async function Products_Less_Price(price) {
    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
    const db = client.db(MONGODB_DB_NAME);
    console.log('Connected to MongoDB successfully!');
    const collection = db.collection('products');
    const products_less = await collection.find({"price":{$lt:price}}).toArray();
    console.log(products_less);  
    client.close();
    console.log('Disconnected from MongoDB successfully!');
}

// Find all products sorted by price
async function Products_Sorted_Price(price) {
    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
    const db = client.db(MONGODB_DB_NAME);
    console.log('Connected to MongoDB successfully!');
    const collection = db.collection('products');
    const products_price_sorted = await collection.aggregate([{$sort : {"price":1}}]).toArray();  
    console.log(products_price_sorted);  
    client.close();
    console.log('Disconnected from MongoDB successfully!');
}

// Find all products sorted by date
async function Products_Sorted_Price(price) {
  const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
  const db = client.db(MONGODB_DB_NAME);
  console.log('Connected to MongoDB successfully!');
  const collection = db.collection('products');
  const products_date_sorted = await collection.aggregate([{$sort : {"date":1}}]).toArray();  
  console.log(products_date_sorted);  
  client.close();
  console.log('Disconnected from MongoDB successfully!');
}

// Find all products scraped less than 2 weeks


