const mongoose = require("mongoose");
const File = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0
  },
 

});
module.exports = mongoose.model("notes", File);
