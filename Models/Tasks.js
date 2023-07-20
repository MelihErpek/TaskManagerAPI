var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tasksSchema = new Schema({
  Name: {
    type: String,
  },
  Team: {
    type: String,
  },
  BaslangicTarihi: {
    type: Date,
  },
  BitisTarihi: {
    type: Date,
  },
  Status: {
    type: String,
  },
  Aciklama: {
    type: String,
  },
});
const Tasks = mongoose.model("Tasks", tasksSchema);

module.exports = Tasks;
