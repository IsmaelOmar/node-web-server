const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

var app = express();

/* this will let view our hbs template files in the browser by using app.get(),
to set the route and the body of the page*/
app.set('view engine', 'hbs');



/* This is an example of a middleware function that logs the method used
  to render the page, the url of the page and the time and date that the page
  was rendered, it saves this in a file called server.log and that file is
  updated every time the page is refreshed*/
app.use ((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`

    console.log(log);

    fs.appendFile('server.log', log + '\n', (err) => {
      if (err) {
        console.log('Unable to append to server.log');
      }
    });
    next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
//
//
// });

/* this will let us use a static directory so we can type this into the the
browser's url: localhost:3000/help.html; this will let us access our html files
on the browser, the reason this is down here is so that the public directory hbs files also display
the maintenance page. If this line of code was above res.render('maintenance.hbs')
then it would not display the maintenance html page when we put our server in
maintenance mode by not providing the next() function in app.use()*/
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('Home.hbs', {
    pageTitle: 'Home Page',
    message: 'Welcome to the website',
    currentYear: new Date().getFullYear()
  });
});

app.get('/bad', (req, res) => {
  res.send({
    error: 'Unable to handle that request!'
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About page',
    currentYear: new Date().getFullYear()
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
