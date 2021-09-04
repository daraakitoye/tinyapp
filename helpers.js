const bcrypt = require('bcrypt');

const checkIfEmailExists = (email, users) => {
  for (const user in users) {
    const savedEmail = users[user].email;
    if (savedEmail === email) {
      return savedEmail.id;
    }
  }
  return null;
};

//credit for this func: From W7M3 lecture by Lovemore J
const getUserByEmail = (email, users) => {
  for (let id in users) {
    if (users[id].email === email) {
      let user = users[id];
      return user;
    }
  }
  return undefined;
}

// const urlDatabase = {
//   b6UTxQ: { mainURL: "https://www.tsn.ca", userID: "aJ48lW" },
//   i3BoGr: { mainURL: "https://www.google.ca", userID: "aJ48lW" }
// };

const urlsForUser = (id, urlDatabase) => {
  let urlsObj = {};
  for (urls in urlDatabase) {
    if (id === urlDatabase[urls].userID) {
      urlsObj[urls] = urlDatabase[urls];
    }
  }
  return urlsObj;
};

// const obj = urlsForUser("aJ48lW", urlDatabase)
// console.log(Object.keys(obj));



const authenticateUser = (email, password, users) => {

  const user = getUserByEmail(email, users);
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      return user
    }
  }
  return null;
};

module.exports = { checkIfEmailExists, authenticateUser, getUserByEmail }