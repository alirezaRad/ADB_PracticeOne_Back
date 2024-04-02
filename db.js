const { MongoClient } = require('mongodb');

let db;

module.exports = {
    connectToDatabase,
    getDb
};


//Functions
async function connectToDatabase() {
    
    const uri = 'mongodb://localhost:27017';
    const dbName = 'dns';
    return await Connect(uri, dbName);
}
function getDb() {
    if (!db) {
        throw new Error('Database connection is not available');
    }
    return db;
}
async function Connect(uri, dbName) {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    try {
        await client.connect();
        console.log('Connected to database');
        db = client.db(dbName);
        return db;
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
}