const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { checkIfEmailExists, authenticateUser } = require('./helpers')



const generateRandomString = () => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


const urlDatabase = {
  b6UTxQ: { mainURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { mainURL: "https://www.google.ca", userID: "aJ48lW" }
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


const urlsForUser = (id, urlDatabase) => {
  let urlsObj = {};
  for (urls in urlDatabase) {
    if (id === urlDatabase[urls].userID) {
      urlsObj[urls] = urlDatabase[urls];
    }
  }
  return urlsObj;
};
//------------------------------------------------------------------------>
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls', (req, res) => {
  const urls = urlsForUser(req.cookies['user_id'], urlDatabase);
  const user = users[req.cookies['user_id']];

  const templateVars = { urls, user };
  res.render('urls_index', templateVars);

});

//Add a GET Route to Show the Form
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = { user }

  if (req.cookies['user_id'] === undefined) {
    res.redirect('/login')
  } else {
    res.render("urls_new", templateVars);
  }

});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  // const mainURL = urlDatabase[shortURL]['mainURL'];
  const user = users[req.cookies['user_id']];
  const urls = urlsForUser(req.cookies['user_id'], urlDatabase);

  const templateVars = { shortURL, user, urls };
  res.render("urls_show", templateVars);
});

//Redirect Short URLs
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const mainURL = urlDatabase[shortURL].mainURL;

  if (mainURL) {
    res.redirect(mainURL);
  } else {
    res.status(404).send('URL not found. This URL does not exist');
  }
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
  urlDatabase[shortURL] = {
    mainURL: req.body.mainURL,
    userID: req.cookies['user_id']
  }

  res.redirect(`urls/${shortURL}`)

});

app.post('/register', (req, res) => {
  const user_id = generateRandomString();
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

  console.log(users);
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

  console.log(req.params.shortURL)
  console.log(urlDatabase[req.params.shortURL])
  console.log(urlDatabase[req.params.shortURL].userID)
  //console.log(urlsForUser())


  const ID = req.cookies['user_id'];
  if (ID === urlDatabase[shortURL].userID) {
    console.log('it worked!');
    urlDatabase[shortURL].mainURL = req.body.newURL
    console.log(urlDatabase)
    res.redirect(`${shortURL}`)
  } else {
    res.status(400).send("Unauthorized user");
  }

})


//Deletes unwanted urls
app.post('/urls/:shortURL/delete', (req, res) => {
  const ID = req.cookies['user_id'];
  const shortURL = req.params.shortURL;
  const userObj = urlsForUser(ID);
  const userObjArr = Object.keys(userObj);

  //console.log(urlDatabase)
  // console.log(ID);

  if (ID === urlDatabase[shortURL].userID) {
    console.log('it worked??')
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls')
  } else {
    res.status(400).send("Unauthorized user");
  }
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});
