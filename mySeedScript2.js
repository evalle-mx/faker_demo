/** mySeedScript2.js
    https://dev.to/cameronblandford/seeding-mongo-with-realistic-records-using-faker-509j
    Loads users and Post into a new collection, using MongoClient and lodash for RELATIONSHIP on previous data
    Users have n Posts (each post relates to one User existant)
 */
require('dotenv').config()

// require the necessary libraries
const faker = require("faker");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const _ = require("lodash"); //random selection of an existing item previously pushed to the an array

// Limit/max of documents
const nUsers = 50, nPosts = 50;
const dbName = "test-db";
// Connection URL
const uri = process.env.MONGO_URI; //mongodb+srv://<USERNAME>:<PASSWORD]>@<CLUSTER.NAME>.mongodb.net/test-db  || mongodb://127.0.0.1:2717/test-db

async function seedDB() {
    
    const client = new MongoClient(uri, {});

    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);


        const usersCollection = db.collection("users");
        const postsCollection = db.collection("posts");

        // The drop() command destroys all data from a collection.
        // Make sure you run it against proper database and collection.
        usersCollection.drop();
        // make a bunch of users
        let users = [];
        for (let i = 0; i < nUsers; i += 1) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            let newUser = {
            email: faker.internet.email(firstName, lastName),
            firstName,
            lastName,
            password: "password123"
            };
            users.push(newUser);

            // visual feedback always feels nice!
            console.log(`New User email: ${newUser.email}` );
        }
        let resUsers = await usersCollection.insertMany(users);
        console.log(resUsers);
        console.log(`Database seeded with ${resUsers.insertedCount} users! :)`);


        // The drop() command destroys all data from a collection.
        // Make sure you run it against proper database and collection.
        postsCollection.drop();

        // make a bunch of posts
        let posts = [];
        for (let i = 0; i < nPosts; i += 1) {
            let newPost = {
            title: faker.lorem.words(7),
            body: faker.lorem.words(500),

            // use lodash to pick a random user as the author of this post
            author: _.sample(users),

            // use lodash to add a random subset of the users to this post
            likes: _.sampleSize(users, Math.round(Math.random * users.length)).map(
                user => user._id
            )
            };
            posts.push(newPost);

            // visual feedback again!
            console.log(`Post title: ${newPost.title}.`);
        }
        let resPosts = await postsCollection.insertMany(posts);
        

        // console.log(`Database seeded with ${timeSeriesData.length} records! :)`);

        console.log(resPosts);
        console.log(`Database seeded with ${resPosts.insertedCount} posts! :)`);

        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

seedDB();
