const checkIfEmailExists = (email, users) => {
  for (const user in users) {
    const savedEmail = users[user].email;
    if (savedEmail === email) {
      return true;
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
  return null;
}

const authenticateUser = (email, password, users) => {

  const user = getUserByEmail(email, users);
  if (user) {
    if (user.password === password) {
      return user;
    }
  }
  return null;
};

module.exports = { checkIfEmailExists, authenticateUser }