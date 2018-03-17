const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//process.env contains all environment variables
//PORT will be set by Heroku and it will change each time the app is deployed
const port = process.env.PORT || 3000;

var app = express();

//This allows us to reuse parts of HTML which repeats across different pages
//the directory should be the path of the folder containing partial HTMLs
hbs.registerPartials(__dirname+'/views/partials');

//helpers are functions that can be called from inside templates
hbs.registerHelper('getCurrentYear',()=>{
    return new Date().getFullYear();
} );

hbs.registerHelper('screamIt', (text)=>{
    return text.toUpperCase();
});

//used to set the configurations of the express app
app.set('view engine', 'hbs');

//custom middleware
//next is used to tell express when the middleware functionality is fully executed
//middleware is synchronous. Application will block for the middleware execution and will continue to run only when next() is called
app.use((req, res, next)=>{
    var now = new Date().toString();
    var msg = `${now}: ${req.method} ${req.url}`;
    console.log(msg);
    fs.appendFile('server.log', msg + '\n');
    next();
});

// app.use((req, res, next)=>{
//     res.render('maintainence.hbs');
// });

//app.use can be used to register middleware
//__dirname stores the path to project directory
app.use(express.static(__dirname+'/public'));

//registering a handler for get request on the root of the app
app.get('/', function(request, response) {
    //response.send('<h1>Hello express</h1>');
    // response.send({
    //     name:'Sonia',
    //     likes:[
    //         'Books',
    //         'Korean series'
    //     ]
    // });
    response.render('home.hbs', {
        pageTitle:'Welcome page',
        welcomeMessage:'Welcome to my first express app'
    })
});

app.get('/about', (req, res)=>{
    res.render('about.hbs', {
        pageTitle: 'About page'
    });
});

app.get('/bad', (req, res)=>{
    res.send({
        errorMsg:'Unable to process request'
    });
});

app.get('/projects', (req, res)=>{
    res.render('projects.hbs',{
        pageTitle:'Projects'
    });
});

//binds the application to a port on local host
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});
