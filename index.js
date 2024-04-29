const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());


const corsOpts = {
    origin: '*',
    methods: [
    'GET',
    'POST',
    'PATCH',
    'PUT',
    'DELETE',
    'OPTIONS'
    ],
    allowedHeaders: [
    'Content-Type',
    ],
    };
    app.use(cors(corsOpts));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brerg1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



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

        const itemCollection = client.db('artistryDB').collection('items');


        app.get('/craftItem', async(req, res)=>{
            const cursor = itemCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.post('/craftItem', async(req, res)=>{
            const newItem = req.body;
            console.log(newItem);
            const result = await itemCollection.insertOne(newItem);
            res.send(result)
        })

        app.put(`/craftItem/:id`, async(req, res)=>{
            const id = req.params.id;
            const filter = {_id:  new ObjectId(id)};
            const options = {upsert: true};
            const updatedItem = req.body;
            const item ={
                $set: {
                    name: updatedItem.name,
                    email: updatedItem.email,
                    image: updatedItem.image, 
                    item_name: updatedItem.item_name, subcategory_Name: updatedItem.subcategory_Name,
                    short_description: updatedItem.short_description, 
                    price: updatedItem.price, 
                    rating: updatedItem.rating, 
                    customization: updatedItem.customization, 
                    processing_time: updatedItem.processing_time,
                    stockStatus: updatedItem.stockStatus,
                }
            }
            const result = await itemCollection.updateOne(filter,item, options);
            res.send(result)
        })

        app.delete('/craftItem/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id:  new ObjectId(id)}
            const result = await itemCollection.deleteOne(query);
            res.send(result)
        })
        app.get('/craftItem/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id:  new ObjectId(id)}
            const result = await itemCollection.findOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running')
})

app.listen(port, () => {
    console.log(`server is fine${port}`);
})