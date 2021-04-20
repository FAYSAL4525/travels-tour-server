
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qthye.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
	const touristPlacecollection = client.db("travelTours").collection("touristplaces");

	const guidedListcollection = client.db("travelTours").collection("guidedList");

	const addBookingscollection = client.db("travelTours").collection("addBookings");

	const addAdmincollection = client.db("travelTours").collection("Admin");

	const addReviewcollection = client.db("travelTours").collection("review");

	app.post('/addPlaces', (req, res) => {
		const places = req.body;
		touristPlacecollection.insertOne(places)
		.then(result => {
			res.send(result.insertCount>0)
		})
	})

	app.post('/addGuided', (req, res) => {
		const places = req.body;
		guidedListcollection.insertOne(places)
			.then(result => {
				res.send(result.insertCount > 0)
			})
	})

	app.post('/addAdmin', (req, res) => {
		const places = req.body;
		addAdmincollection.insertOne(places)
			.then(result => {
				res.send(result.insertCount > 0)
			})
	})

	app.get('/touristplaces', (req, res) => {
		touristPlacecollection.find({})
			.toArray((err, documents) => {
				res.send(documents)
			})
	})

	app.get('/guidedList', (req, res) => {
		guidedListcollection.find({})
			.toArray((err, documents) => {
				res.send(documents)
			})
	})

	app.get('/touristplaces/:key', (req, res) => {
		touristPlacecollection.find({ _id: ObjectId(req.params.key) })

			.toArray((err, documents) => {
				res.send(documents)
			})
		console.log(touristPlacecollection)
	})

	app.get('/guidedList/:id', (req, res) => {
		guidedListcollection.find({ _id: ObjectId(req.params.id) })

			.toArray((err, documents) => {
				res.send(documents)
			})
		console.log(guidedListcollection)
	})

	app.post('/addBook', (req, res) => {
		const booking = req.body;
		console.log(booking);
		addBookingscollection.insertOne(booking)
			.then(result => {
				console.log(result);
				res.send(result.insertedCount > 0)
			})
	})

	// app.get('/addBookings', (req, res) => {
	// 	addBookingscollection.find({ email: req.query.email })
	// 		.toArray((err, items) => {
	// 			res.send(items);
	// 		})

	// })

	app.get('/review', (req, res) => {
		addReviewcollection.find({})
			.toArray((err,documents) => {
				res.send(documents);
			})
	})

	app.post('/review', (req, res) => {
		const review = req.body;
		console.log(review);
		addReviewcollection.insertOne(review)
			.then(result => {
				console.log(result);
				res.send(result.insertedCount > 0)
			})
	})

	app.delete('/delete/:id', (req, res) => {
		const id = ObjectId(req.params.id);
		touristPlacecollection.deleteOne({ _id: id })
			.then(result => {
				console.log(result);
			})
	})

	// app.get('/addBookings', (req, res) => {
	// 	addBookingscollection.find({ email: req.query.email })
	// 		.toArray((err, items) => {
	// 			res.send(items);
	// 		})

	// })


	app.get('/addBookings', (req, res) => {
		addBookingscollection.find({})
			.toArray((err, bookings) => {
				res.send(bookings);
			})
	})

	app.post('/addBookings', (req, res) => {
		const email = req.body;
		console.log(email);
		addAdmincollection.find({ email: email.email})
			.toArray((err, admin) => {
				const filter ={email:email.email}
				if (admin.length===0)
					
					addBookingscollection.find(filter)
						.toArray((err, documents) => {
							res.send(documents)
							console.log(documents);
						})
			})	
	})

	// perform actions on the collection object
	console.log("database connected");
	// client.close();
});


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})