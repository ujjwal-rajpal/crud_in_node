// require helmet
const helmet = require('helmet');

// require morgan
const morgan = require('morgan');

// require validation module joi
const Joi = require('@hapi/joi');

// require logger module
const log = require('./logger');

// require auth module
const auth = require('./Authentication');

// require express module
const express = require('express');
const app = express();

// json data
app.use(express.json());

//urlencoded data
// app.use(express.urlencoded());   //body-parser deprecated undefined extended: provide extended option index.js:19:17
app.use(express.urlencoded({extended : true}));

// serving static data
app.use(express.static('public'));

//creating a middleware for loging
app.use(log);

// creating a middleware for authenticating

app.use(auth);

// use helmet
app.use(helmet());

//use morgan
app.use(morgan('tiny'));

// random array
const library = [
    {id : 1, book_name : "python"},
    {id : 2, book_name : "Java"},
    {id : 3, book_name : "node.js"},
];


//get all request
app.get('/api/library', (req,res)=>{
res.send(library);
});

app.get('/api/library/:id',(req,res)=>{
    const book = library.find(found=>found.id === parseInt(req.params.id));
    if (!book) return res.status(401).send("this Id does not exist");

    res.send(book);
});

//create a resource
app.post('/api/library', (req,res)=>{
    //check validation

    const error = validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    //create resourse if validated
    const book = {
        id: library.length+1,
        book_name : req.body.name 
    };

    library.push(book);
    res.status(201).send(book);
    });

//update a resource
app.put('/api/library/:id', (req,res)=>{

    const id = (req.params.id);
    const book = library.find(found=>found.id === parseInt(id));
   if(!book) return res.status(401).send("this Id does not exist");

        //check validation
        const error = validate(req.body);
    
        if(error) return res.status(400).send(error.details[0].message);
        
        //update the book name
   book.book_name = req.body.name;
   
    
    res.status(202).send(book);
    });

  // delete a resource
  
  app.delete('/api/library/:id', (req,res)=>{
    const id = (req.params.id);
    const book = library.find(found=>found.id === parseInt(id));
   if(!book) return res.status(401).send("this Id does not exist");

    // delete resource
   const index = library.indexOf(book);
   library.splice(index,1);
    res.status(204).end();
    
  });


//create function to validate 
function validate(body){
    const schema = {

        name: Joi.string().required(),
        
    };

    const {error} = Joi.validate(body, schema);
    return error;
}


app.listen(3000);
