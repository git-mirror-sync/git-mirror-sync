var passport = require("./passport.js");
var schema = require("./schema.js");

module.exports = {
  passport: passport,
  schemas: schema,
  models: schema.models
};
