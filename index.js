require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 9000;
const app = express();
// middleware
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.upkox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const menuCollection = client.db("aurora-bites").collection("menu");
    const userCollection = client.db("aurora-bites").collection("users");
    const reviewsCollection = client.db("aurora-bites").collection("reviews");
    const cartCollection = client.db("aurora-bites").collection("carts");

    // user related api
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const userInfo = req.body;
      const result = await userCollection.insertOne(userInfo);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // cart related api
    app.get("/cart", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const foodInfo = req.body;
      const result = await cartCollection.insertOne(foodInfo);
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // menu related api
    app.get("/menu", async (req, res) => {
      const limit = Number(req.query.limit);
      const category = req.query.category;
      let query = {};

      if (category) {
        query = { category };
      }

      const result = await menuCollection.find(query).limit(limit).toArray();
      res.send(result);
    });

    // review related api
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    // await client.connect();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Aurora Bites Server Is Running....");
});
app.listen(port, () => {
  console.log(`Aurora Bites Server Is Running On PORT ${port}`);
});
