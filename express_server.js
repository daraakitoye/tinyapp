const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');


const generateRandomString = () => {
  const randString = Math.random().toString(16).slice(9);
  return randString;
}


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//------------------------------------------------------------------------>
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls', (req, res) => {

  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);

});

//Add a GET Route to Show the Form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const mainURL = urlDatabase[shortURL];
  const templateVars = { shortURL, mainURL };
  res.render("urls_show", templateVars);
});

//Redirect Short URLs
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const mainURL = urlDatabase[shortURL];

  if (res.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching IP. This url does not exist.`;
    res.send(msg);
    return;
  }
  res.redirect(mainURL);
});
//-------------------------------------------------------------------------------------------------------------------------->

//Auto updates urlDatabase with generated short URLs
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.mainURL
  res.redirect(`urls/${shortURL}`)

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