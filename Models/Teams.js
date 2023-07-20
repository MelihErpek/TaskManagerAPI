var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const teamsSchema = new Schema({
  Name: {
    type: String,
  },
  Admin: {
    type: String,
  },
});
const Teams = mongoose.model("Teams", teamsSchema);

module.exports = Teams;
