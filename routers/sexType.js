var express      = require("express");
var mongoose     = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var SexType      = require('../models/sexType');
var validator    = require('express-route-validator')

// API routes
var router = express.Router();

router.route('/sexTypes')
  .get(function (req, res) {
        var promise = SexType.find().exec();
        promise.then(function(sexTypes) {
           response(res,sexTypes);
        })
        .catch(function(err){
            // just need one of these
            //console.log('error:', err);
            res.status(500).send(err.message);
        });
    })
  .post(validator.validate({
         body: {
                code:             { isRequired: true },
                description:      { isRequired: true }
              },
              headers: {
                'content-type': { isRequired: true, equals: 'application/json' }
              }
        }),
        function(req, res) {
            //console.log('POST');
            //console.log(req.body);
            var sexType = new SexType({
                  code: req.body.code,
                  description: req.body.description
            });
            var promise = sexType.save();
            promise.then(function(sexType) {
              response(res,sexType);
            })
            .catch(function(err){
              // just need one of these
              //console.log('error:', err);
              res.status(500).send(err.message);
            });
        }
  );

router.route('/sexType/:idSexType')
  .get(validator.validate({
          params: {
            idSexType: { isRequired: true , isMongoId: true }
          }
      }),
      function(req, res) {
          var promise = SexType.findById(req.params.idSexType).exec();
          promise.then(function(sexType) {
            //console.log('GET /sexTypes/' + req.params.idSexType);
             response(res,sexType);
          })
          .catch(function(err){
            // just need one of these
            //console.log('error:', err);
            res.status(500).send(err.message);
          });
       }
  )
  .put(validator.validate({
          params: {
            idSexType: { isRequired: true , isMongoId: true }
          }
      }),
      function(req, res) {
          //console.log('PUT');
          //console.log(req.body);
          var promise = SexType.findById(req.params.idSexType).exec();
          promise.then(function(sexType) {
            if(sexType){
                sexType.code = req.body.code,
                sexType.description = req.body.description
                return sexType.save(); // returns a promise
            }
          })
          .then(function(sexType) {
              var message = "SexType successfully updated.";                
              response(res,sexType,message);
          })
          .catch(function(err){
              // just need one of these
              //console.log('error:', err);
              res.status(500).send(err.message);
          }); 
      }
  )
  .delete(validator.validate({
              params: {
                idSexType: { isRequired: true, isMongoId: true }
              }
          }),
          function(req, res) {
              SexType.findByIdAndRemove(req.params.idSexType, function (err, sexType) {  
                 if(err)
                    res.status(500).send(err.message);
                 var message = "SexType successfully deleted.";                
                 response(res,sexType,message);
              });
          }
  );
var response = function(res,sexType,messageOK,messageNotOK){
    if(sexType) {
      var resp = {
                  message: messageOK,
                  id:sexType._id
                };
      if(messageOK){
        res.status(200).jsonp(resp);
      }else{
        res.status(200).jsonp(sexType);
      }
    }else{
      var dfault =  "SexType Not Found";
      if(messageNotOK){
        res.status(400).send(messageNotOK);
      }else{
        res.status(400).send(dfault);
      }
    }
};
module.exports = router