const mongoose = require('mongoose');
const schema = mongoose.Schema;

const query_schema = new schema(
  {
    term: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },    
  }, 

  { 
    versionKey: false
  }
);

// Sets the createdAt attribute equal to the current time
query_schema.pre('save', next => {
  if(!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

// Exports the query_schema for use elsewhere.
module.exports = mongoose.model('query', query_schema);