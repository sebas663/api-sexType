var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;

var SexTypeSchema = new Schema({
        code :            String,
        description :     String,
        enable :          { type: Boolean, default: true }
});
// the schema is useless so far
// we need to create a model using it
var SexType = mongoose.model('SexType', SexTypeSchema);

// make this available to our users in our Node applications
module.exports = SexType;