//const bcrypt = require('bcrypt');



//credit for this func: From W7M3 lecture by Lovemore J
const getUserByEmail = (email, users) => {
  for (let id in users) {
    const user = users[id];
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
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






module.exports = { getUserByEmail, urlsForUser }