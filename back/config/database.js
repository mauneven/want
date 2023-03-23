const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://mauneven:admin123@want.oik7qz6.mongodb.net/want?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas!');
  } catch (error) {
    console.log('Error connecting to MongoDB Atlas:', error);
  }
}

connect();