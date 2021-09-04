const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
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
};

const testDatabase = {
  b6UTxQ: { mainURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { mainURL: "https://www.google.ca", userID: "aJ48lW" }
};


describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = testUsers.userRandomID;

    assert.equal(user, expectedOutput);
  });
  it('should return a undefind for non-existent/invalid user email', function () {
    const user = getUserByEmail("user-fake@example.com", testUsers)
    const expectedOutput = undefined;

    assert.equal(user, expectedOutput);
  });

});

describe('urlsForUser', function () {
  it('should return the URLs where the userID is equal to the id of the currently logged-in user.', function () {
    const urls = urlsForUser("aJ48lW", testDatabase)
    const expectedOutput = testDatabase

    assert.deepEqual(urls, expectedOutput);
  });

  it('should return an empty object for a user that does not exist.', function () {
    const urls = urlsForUser("dummy", testDatabase)
    const expectedOutput = {}

    assert.deepEqual(urls, expectedOutput);
  });

});