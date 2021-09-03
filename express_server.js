const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { checkIfEmailExists, authenticateUser } = require('./helpers')



const generateRandomString = () => {
  const randString = Math.random().toString(16).slice(9);
  return randString;
}


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}



//------------------------------------------------------------------------>
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls', (req, res) => {
  const urls = urlDatabase;
  const user = users[req.cookies['user_id']];

  const templateVars = { urls, user };
  res.render('urls_index', templateVars);

});

//Add a GET Route to Show the Form
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = { user }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const mainURL = urlDatabase[shortURL];
  const user = users[req.cookies['user_id']];

  const templateVars = { shortURL, mainURL, user };
  res.render("urls_show", templateVars);
});

//Redirect Short URLs
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const mainURL = urlDatabase[shortURL];


  res.redirect(mainURL);
});

app.get('/register', (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = { user };


  res.render('register', templateVars);
});
app.get('/login', (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = { user };

  res.render('urls_login', templateVars)
});
//-------------------------------------------------------------------------------------------------------------------------->

//Auto updates urlDatabase with generated short URLs
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.mainURL
  res.redirect(`urls/${shortURL}`)

});

app.post('/register', (req, res) => {
  const user_id = 'user-' + generateRandomString();
  const emailCheck = checkIfEmailExists(req.body.email, users);

  const user = {
    id: user_id,
    email: req.body.email,
    password: req.body.password
  }

  if (emailCheck) {
    res.status(400).send('Sorry, the account associated with this email already exists.');
  } else {
    users[user_id] = user;
  }

  res.cookie('user_id', user_id)
  res.redirect('/urls')
});




app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = authenticateUser(email, password, users)



  if (user) {
    res.cookie('user_id', user.id);
    res.redirect('/urls')
    return;
  }
  else {
    res.status(403).send('Invalid email and/or password. Please sumbit a valid email/password or create a new account.')
    return;
  }

});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls')
});


//redirects users to edit page and allows them to change the shortURL to a new value
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.mainURL
  res.redirect(`${shortURL}`)
})


//Deletes unwanted urls
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls')
});


app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});
