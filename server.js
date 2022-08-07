console.log('May Node be with you');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb+srv://plenoptic:P6B0WR6s8u9WrOwG@cluster0.7fj9g0b.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars');
    const quotesCollection = db.collection('quotes');

    //allows rendering of page in ejs
    app.set('view_engine', 'ejs')

    //Allows public folder to be used by the public/browsers
    app.use(express.static('public'))

    //allows server to accept data as JSON
    app.use(bodyParser.json())

    //Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded( {extended: true}));

    app.listen(3000, function() {
        console.log('Server is running on port 3000');
    });
    
    app.get('/', (req, res) => {
        quotesCollection.find().toArray()
        .then(results => {
            res.render('index.ejs',{quotes: results})
            }
        )
        .catch(error => console.error(error))
    })
    
    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
        .then(results => {
                console.log(results)
                res.redirect('/');
            }
        )
        .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
        console.log(req.body)
        quotesCollection.findOneAndUpdate(
            { name: 'Yoda' },
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            { 
                upsert: true
            }
        )

        .then(result => { 
            console.log(result)
            res.json('Success')
        })
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
            {name: req.body.name},
        )
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json('No quote to delete.')
            }
            res.json('Deleted Darth Vader Quote')
        })
        .catch(error => console.error(error))
    })
  })
  .catch(error => console.error(error))



