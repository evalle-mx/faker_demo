require('dotenv').config()
// require the necessary libraries
const faker = require('faker');
const MongoClient = require('mongodb').MongoClient;
    
const nRecords = 20;
const dbName = 'test-db';
const collName = 'tseAgents';
    
async function seedDB() {
        
    // Connection URL
    const uri = process.env.MONGO_URI; //mongodb+srv://<USERNAME>:<PASSWORD]>@<CLUSTER.NAME>.mongodb.net  || mongodb://127.0.0.1:2717
    
    const client = new MongoClient(uri, {});
    
    try {
        await client.connect();
        console.log("Connected correctly to server");

        const collection = client.db(dbName).collection(collName);
    
        // The drop() command destroys all data from a collection.
        collection.drop();
    
            // make a bunch of time series data
        let documents = [];
    
            for (let i = 0; i < nRecords; i++) {
                let newAgent = getAgent();
                console.log('adding newAgent: ', newAgent);
                documents.push(newAgent);
            }

            console.log(documents);
            let res = await collection.insertMany(documents);
    
            console.log(`Database  seeded with ${documents.length} records! :)`);
    
            console.log(res);
            console.log(`Database seeded with ${res.insertedCount} records! :)`);
    
            client.close();
        } catch (err) {
            console.log(err.stack);
        }
}
  https://media.charthop.com/org/5b7f0d34bd35a924ac9d2bf2/2022/11/14/6372468567fac83015b82367n5xWl2NeouvvGRARjWzojCv-GnapYIQU.png

function rdmFromInterv(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const workMods = ['1-In Office', '2-Flexible', '3-Remote'];
const locations = ['USA_TX_Austin','CAN_ONT_Toronto', 'USA_CA_PaloAlto','CAN_BC_Vancouver'];
const titles = ['Associate TSE I', 'Associate TSE II'];

const getAgent = () =>{
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();


    let newAgent = {
        firstName : firstName,
        lastName : lastName,
        workEmail: mdbEmail(firstName,lastName), //faker.internet.email(firstName, lastName),
        startDate: faker.date.between({ from: '2015-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' }), // '2026-05-16T02:22:53.002Z'
        image: `https://robohash.org/${firstName}`, //faker.image.avatar(),
        workingModel: workMods[rdmFromInterv(0,workMods.length-1)],
        location: locations[rdmFromInterv(0,locations.length-1)],
        title: titles[rdmFromInterv(0,titles.length-1)],
        tenure: rdmFromInterv(10,32),
        region: 'NA',
        manager: '',
    };
    return newAgent;
}

const mdbEmail = (firstName,lastName) => {
    return firstName+'.'+lastName+'@mongodb.com';
}

//RUN
seedDB();
    