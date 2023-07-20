var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  AdSoyad: {
    type: String,
  },
  Mail: {
    type: String,
  },
  Sifre: {
    type: String,
  },
  Role:{
    type:String,
  }
});
const User = mongoose.model("User", userSchema);

module.exports = User;
