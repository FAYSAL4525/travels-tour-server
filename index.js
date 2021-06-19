const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qthye.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const touristPlacecollection = client
    .db("travelTours")
    .collection("touristplaces");

  const guidedListcollection = client
    .db("travelTours")
    .collection("guidedList");

  const addBookingscollection = client
    .db("travelTours")
    .collection("addBookings");

  const addAdmincollection = client.db("travelTours").collection("Admin");

  const addReviewcollection = client.db("travelTours").collection("review");

  //api for add places
  app.post("/addPlaces", (req, res) => {
    const places = req.body;
    touristPlacecollection.insertOne(places).then((result) => {
      res.send(result.insertCount > 0);
    });
  });

  //api for get places
  app.get("/touristplaces", (req, res) => {
    touristPlacecollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //api for get specific touristPlaces by id
  app.get("/touristplaces/:key", (req, res) => {
    touristPlacecollection
      .find({ _id: ObjectId(req.params.key) })

      .toArray((err, documents) => {
        res.send(documents);
      });
    console.log(touristPlacecollection);
  });

  //api for add Guide in mongodb
  app.post("/addGuided", (req, res) => {
    const places = req.body;
    guidedListcollection.insertOne(places).then((result) => {
      res.send(result.insertCount > 0);
    });
  });

  //api for get guides
  app.get("/guidedList", (req, res) => {
    guidedListcollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //api for get specific guided by id
  app.get("/guidedList/:id", (req, res) => {
    guidedListcollection
      .find({ _id: ObjectId(req.params.id) })

      .toArray((err, documents) => {
        res.send(documents);
      });
    console.log(guidedListcollection);
  });

  //api for add booking in mongobd
  app.post("/addBook", (req, res) => {
    const booking = req.body;
    console.log(booking);
    addBookingscollection.insertOne(booking).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  //api for get specific bookings by email for user
  app.post("/addBookings", (req, res) => {
    const email = req.body;
    console.log(email);
    addAdmincollection.find({ email: email.email }).toArray((err, admin) => {
      const filter = { email: email.email };
      if (admin.length === 0)
        addBookingscollection.find(filter).toArray((err, documents) => {
          res.send(documents);
          console.log(documents);
        });
    });
  });

  //api for add admin
  app.post("/addAdmin", (req, res) => {
    const places = req.body;
    addAdmincollection.insertOne(places).then((result) => {
      res.send(result.insertCount > 0);
    });
  });

  //api for get admin
  app.get("/isAdmin", (req, res) => {
    addAdmincollection
      .find({ email: req.query.email })
      .toArray((err, docs) => res.send(!!docs.length));
  });

  //api for get All bookings for Admin
  app.get("/addBookings", (req, res) => {
    addBookingscollection.find({}).toArray((err, bookings) => {
      res.send(bookings);
    });
  });

  //api for get specific booking by id for Admin to modify status
  app.patch("/update/:itemId", (req, res) => {
    const id = req.params.itemId;
    addBookingscollection
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: { status: req.body.value },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  // api for delete service
  app.delete("/delete/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    touristPlacecollection.deleteOne({ _id: id }).then((result) => {
      console.log(result);
    });
  });

  //api for post review
  app.post("/review", (req, res) => {
    const review = req.body;
    console.log(review);
    addReviewcollection.insertOne(review).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  //api for get review
  app.get("/review", (req, res) => {
    addReviewcollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // perform actions on the collection object
  console.log("database connected");
  // client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
