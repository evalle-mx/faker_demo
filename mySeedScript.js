/** mySeedScript.js
    https://www.mongodb.com/developer/products/mongodb/seed-database-with-fake-data/
    Loads data (timeSeries) into a new collection, using MongoClient
 */
require('dotenv').config()

// require the necessary libraries
const faker = require("faker");
const MongoClient = require("mongodb").MongoClient;

// const num_of_records = 5;

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedDB(num_of_records) {
    
    // Connection URL
    const uri = process.env.MONGO_URI; //mongodb+srv://<USERNAME>:<PASSWORD]>@<CLUSTER.NAME>.mongodb.net/test-db  || mongodb://127.0.0.1:2717/test-db

    const client = new MongoClient(uri, {
        //useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log("Connected correctly to server");

        const collection = client.db("test-db").collection("kitty-litter-time-series");

        // The drop() command destroys all data from a collection.
        // Make sure you run it against proper database and collection.
        collection.drop();

        // make a bunch of time series data
        let timeSeriesData = [];

        for (let i = 0; i < num_of_records; i++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            let newDay = {
                timestamp_day: faker.date.past(),
                cat: faker.random.word(),
                owner: {
                    email: faker.internet.email(firstName, lastName),
                    firstName,
                    lastName,
                },
                events: [],
            };

            for (let j = 0; j < randomIntFromInterval(1, 6); j++) {
                let newEvent = {
                    timestamp_event: faker.date.past(),
                    weight: randomIntFromInterval(14,16),
                }
                newDay.events.push(newEvent);
            }

            
            //console.log('adding newDay: ', newDay);
            timeSeriesData.push(newDay);
        }
        console.log(timeSeriesData);
        let res = await collection.insertMany(timeSeriesData);

        // console.log(`Database seeded with ${timeSeriesData.length} records! :)`);

        console.log(res);
        console.log(`Database seeded with ${res.insertedCount} records! :)`);

        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

if (process.argv.length === 2) { //https://www.digitalocean.com/community/tutorials/nodejs-command-line-arguments-node-scripts
    console.error('Expected the number of records to seed!');
    process.exit(1);
  }
else{
    seedDB(process.argv[2]);
}
