const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assetSchema = new Schema({
    assetURL : {type : String},
    available : {type : Boolean, default : true}
});

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;