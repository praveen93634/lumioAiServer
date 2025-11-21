

var admin = require("firebase-admin");

var serviceAccount = require("./Secret-Key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
// module.exports = admin;
export default admin;