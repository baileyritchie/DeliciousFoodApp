const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type:String,
        trim: true,
        required: 'Please enter a store name'
    },
    slug: String,
    description: {
        type:String,
        trm: true
    },
    tags: [String]

});

storeSchema.pre('save',function(next){
    if (!this.isModified('name')){
        next(); //skips db middleware
        return; // ends function, can continue saving
    }
    this.slug = slug(this.name);
    next();
    // TODO make more resilient so slugs are unique
});


module.exports = mongoose.model('Store',storeSchema);

