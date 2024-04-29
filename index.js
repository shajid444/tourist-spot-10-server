const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// touristSpot
// a1mmsoqv30vHgU05
// console.log(process.env.DB_USER);



const uri = "mongodb://localhost:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const placeCollection = client.db('TouristSpotDB').collection('place');
    const userCollection = client.db('TouristSpotDB').collection('user');

    app.get('/place', async(req, res) =>{
        const cursor = placeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/place/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await placeCollection.findOne(query);
        res.send(result);
    })



    app.post('/place', async(req, res)=>{
        const newPlace = req.body;
        console.log(newPlace);
        const result = await placeCollection.insertOne(newPlace);
        res.send(result);
    })

    app.put('/place/:id', async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true};
           const updatedPlace = req.body;
        const Place ={
            $set: {
                photo:updatedPlace.photo, 
                tourists_spot_name:updatedPlace.tourists_spot_name,
                 country_name:updatedPlace.country_name, 
                 location:updatedPlace.location, 
                 totalVisitor:updatedPlace.totalVisitor,
                  shortDescription:updatedPlace.shortDescription, 
                  avgCost:updatedPlace.avgCost, 
                  seasonality:updatedPlace.seasonality, 
                  travelTime: updatedPlace.travelTime

            }
        }

        const result = await placeCollection.updateOne(filter , Place, options);
        res.send(result);


    })

    app.delete('/place/:id', async(req, res)=>{

        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await placeCollection.deleteOne(query);
        res.send(result);

    })

    // user related apis

    app.get('/user', async(req, res) =>{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

app.post('/user', async(req, res)=>{

    const user = req.body;
    console.log(user);
    const result = await userCollection.insertOne(user);
    res.send(result);

})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('assignment 10 server site i s runnning');
})
 
app.listen(port, ()=>{
    console.log(`assignment 10 server is running on ${port}`);
})