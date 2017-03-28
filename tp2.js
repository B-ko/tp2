const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
app.set('view engine', 'ejs'); // générateur de template «ejs»
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));  // pour utiliser le dossier public

var db; // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017/Pic_Ex9', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(8081, () => {
    console.log('connexion à la BD et on écoute sur le port 8081')
  });
});





app.get('/',  (req, res) => {
   console.log('la route route get / = ' + req.url);
 
    var cursor = db.collection('adresse').find().toArray(function(err, resultat){
       if (err) return console.log(err);
    // renders index.ejs
    // affiche le contenu de la BD
    res.render('index.ejs', {adresse: resultat});

    });
    

});


app.get('/formulaire',  (req, res) => {
   console.log('la route  get / = ' + req.url);
   res.sendFile(__dirname + "/public/html/form.html");
});


app.get('/detruire/:id', (req, res) => {
  var id = req.params.id
  db.collection('adresse')
  .findOneAndDelete({"_id": ObjectID(req.params.id)}, (err, resultat) => {

  if (err) return console.log(err)
    res.redirect('/')
  })
})

app.post('/modifier/:id', (req, res) =>{
  var id = req.params.id
  db.collection('adresse').findOneAndReplace({"_id":ObjectID(req.params.id)},req.body
  )
  res.redirect('/');
});

app.post('/adresse',  (req, res) => {
  db.collection('adresse').save(req.body, (err, result) => {
      if (err) return console.log(err);
      console.log('sauvegarder dans la BD');
      res.redirect('/');
    });
});


