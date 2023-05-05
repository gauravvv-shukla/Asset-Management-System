const { response } = require('express');
const Asset = require('../models/Asset');

//Update
const updateAsset= (req,res,next) => {
    let assetID = req.body.assetID

    let updatedAsset = {
        assetURL : req.body.newURL,
        available : true
    }

    Asset.findbyIdAndUpdate(assetID, {$set : updatedAsset})
    .then(() => {
        res.json({
            message : "Asset Updated Successfully" 
        })
    })
    .catch(error => {
        res.json({
            message: "An error occured"
        })
    })
    next();
}

module.exports = {
    assetData, deleteAsset, updateAsset
}