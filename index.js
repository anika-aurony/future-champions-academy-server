require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.ACADEMY_USER}:${process.env.ACADEMY_PASS}@cluster0.mu4fgop.mongodb.net/?retryWrites=true&w=majority`;


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

        const instructorsCollection = client.db('FutureChampionsAcademyDB').collection('instructors');
        const activitiesCollection = client.db('FutureChampionsAcademyDB').collection('activities');
        const usersCollection = client.db('FutureChampionsAcademyDB').collection('users');


        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });

        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };

            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);

        })

        app.get('/users/admin/:email',  async (req, res) => {
            const email = req.params.email;
      
            
      
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            console.log(user)
            const result = { admin: user?.role === 'admin' }
            console.log(result)
            res.send(result);
          })

        app.patch('/users/instructor/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: 'instructor'
                },
            };

            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);

        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query);

            if (existingUser) {
                return res.send({ message: 'user already exists' })
            }

            const result = await usersCollection.insertOne(user);
            res.send(result);
        });


        app.get('/instructors', async (req, res) => {
            const cursor = instructorsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/activities', async (req, res) => {
            const cursor = activitiesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/activities', async (req, res) => {
            const activity = req.body;

            const result = await activitiesCollection.insertOne(activity);
            res.send(result)
        })

        app.put('/activities/:id', async (req, res) => {
            const id = req.params.id;
            const activityStatus = req.body;
            console.log(id, activityStatus)
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    status: activityStatus.status,
                    feedback: activityStatus.feedback
                }
            }
            const result = await activitiesCollection.updateOne(filter, updatedUser, options);
            res.send(result)
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


app.get('/', (req, res) => {
    res.send('Future Champions Academy server is running')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})