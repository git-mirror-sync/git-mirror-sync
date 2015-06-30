var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  githubId: String,
  displayName: String,
  username: String,
  email: String,
  accessToken: String,
  refreshToken: String,
  bitbucket: {
    code: String,
    accessToken: String,
    refreshToken: String,
    scopes: String,
    tokenType: String,
    expiresIn: Number
  }
});

var Users = mongoose.model('Users', UserSchema);

module.exports = {
  schemas: {
    user: UserSchema
  },
  models: {
    user: Users
  }
};
