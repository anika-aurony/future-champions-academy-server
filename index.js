require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.ACADEMY_USER}:${process.env.ACADEMY_PASS}@cluster0.mu4fgop.mongodb.net/?retryWrites=true&w=majority`;


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

    const instructorsCollection = client.db('FutureChampionsAcademy').collection('toys');
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Future Champions Academy server is running')
})

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`)
})