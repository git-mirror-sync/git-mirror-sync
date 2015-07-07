var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  githubId: String,
  displayName: String,
  username: String,
  accessToken: String,
  refreshToken: String,
  createdAt: Number,
  bitbucket: {
    code: String,
    refreshToken: String,
    scopes: String,
    tokenType: String,
    createdAt: Number,
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
