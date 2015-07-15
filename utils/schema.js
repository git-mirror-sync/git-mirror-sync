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

var LogSchema = new Schema({
  user: Schema.Types.ObjectId,
  time: Date,
  status: Number,
  repo: String,
  commit: String,
  message: String,
  request: Buffer 
});

var Users = mongoose.model('Users', UserSchema);
var Logs = mongoose.model('Logs', LogSchema);

module.exports = {
  schemas: {
    user: UserSchema,
    log: LogSchema
  },
  models: {
    user: Users,
    log: Logs
  }
};
