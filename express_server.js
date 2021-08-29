const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');


const generateRandomString = () => {
  const randString = Math.random().toString(16).slice(9);
  return randString;
}
//generateRandomString();

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

app.post('/urls', (req, res) => {
  console.log(req.body);
  res.send('Ok');
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

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});