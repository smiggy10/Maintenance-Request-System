const bcrypt = require('bcrypt');

// Function to hash password
const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) reject(err);
      resolve(hashedPassword);
    });
  });
};

module.exports = hashPassword;
