const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId; /* This line for load SINGLE DATA from mongo server */

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4500;

// middleware
app.use(cors());
app.use(express.json());

// username: theking
// RJbnq1vFU0QSC1ed

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jle4m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected to database')
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // GET API (Those code for get all data as json file , from mongodb server)
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });


        // GET Single Service (Those code for get single data as json file , from mongodb server)
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })



        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body
            console.log('Hit the post API', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json = (result)
        });


        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.get('/hello', (req, res) => {
    res.send('hello updated here')
})

app.listen(port, () => {
    console.log('Running Genius Server on port', port);
})