
const router = require('express').Router();
const Asset = require('../models/Asset');
const AWS = require("aws-sdk");
const multer = require("multer");
const mongoose = require("mongoose");
const config = require("../config");    

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true })
    .then(() => console.log(`Mongo DB Succesfully Connected`))
    .catch(err => console.log(err));

    const bucketName = process.env.bucketName;

    const awsConfig = {
      accessKeyId: process.env.AccessKey,
      secretAccessKey: process.env.SecretKey,
      region: process.env.region,
    };
    
    const S3 = new AWS.S3(awsConfig);
    
    //Specify the multer config
    let upload = multer({
      // storage: multer.memoryStorage(),
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter: function (req, file, done) {
        if (
          file.mimetype === "image/jpeg" ||
          file.mimetype === "image/png" ||
          file.mimetype === "image/jpg"
        ) {
          done(null, true);
        } else {
          //prevent the upload
          let newError = new Error("File type is incorrect");
          newError.name = "MulterError";
          done(newError, false);
        }
      },
    });
    
    

    //upload to s3
    const uploadToS3 = (fileData,filename) => {
      return new Promise((resolve, reject) => {
        console.log(filename);
        const params = {
          Bucket: bucketName,
          Key: filename,
          Body: fileData,
        };
        S3.upload(params, (err, data) => {
          if (err) {
            console.log(err);
            return reject(err);
          }

          return resolve(data);
        });
      });
    };
    
    router.post("/upload", upload.single("image"), async (req, res) => {

      let receivedData
      if (req.file) {
        receivedData = await uploadToS3(req.file.buffer,req.file.originalname);
        console.log(receivedData);
        let newAsset = new Asset({
            assetURL : receivedData.Location,
            available : true
          })
          newAsset.save()
          .then(response => {
          res.json({
              message : "Asset added Successfully in the database"
            })
        })
        .catch( error =>
          res.json({
              message : "An error occured"
          })
        )
      }
    
    });

    //Update
    router.post('/update', upload.single("image"), async (req, res) => {
      let receivedData
      if (req.file) {
        receivedData = await uploadToS3(req.file.buffer, req.file.originalname);
        console.log(receivedData);
        let assetID = req.body.assetID
  
        Asset.updateOne(
          { _id: assetID },
          { $set: {  assetURL : receivedData.Location,  available : true } }
          )
        .then(() => {
            res.json({
              message : "Asset Link Updated Successfully" 
            })
          })
        .catch(error => {
            res.json({
              message: "An error occured"
            })
        })
        //Asset.findbyIdAndUpdate(assetID, {$set : updatedAsset})
      }
    }
  )
    
    // //Upload multiple images to s3
    // router.post("/upload-multiple", upload.array("images", 3), async (req, res) => {
    //   if (req.files && req.files.length > 0) {
    //     for (let i = 0; i < req.files.length; i++) {
    //       await uploadToS3(req.files[i].buffer);
    //     }
    //   }
    //   res.send({
    //     msg: "Successfully uploaded " + req.files.length + " files!",
    //   });
    // });
    
    
      //Delete
    router.post("/delete", (req,res) => {
        let assetID = req.body.asset;
        console.log(assetID);
        Asset.updateOne(
            { _id: assetID },
            { $set: { available: false } }
        )
        .then(() => {
            res.json({
                message : "Asset Soft Deleted Successfully" 
            })
        })
        .catch(error => {
            res.json({
                message: "An error occured"
            })
        })
      
      });
      
      //Read
      router.get('/read', (req,res) => {
        Asset.find({ available: true }, { assetURL: 1, _id: 1 })
        .then(response => {
            res.json({
                response
            })
        })
        .catch( error =>
            res.json({
                message : "An error occured"
            })
        )
      })
      
      
      

      module.exports = router;