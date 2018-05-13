import mongoose from 'mongoose'
import connection from '../../connectionMongoose'
const Schema = mongoose.Schema

connection.on('connected', () => {
    console.log('connected')
});
connection.on('disconnected', () => {
    console.log('disconnected')
});

const schemaDiscount = new Schema({
    amountType: String,
    amountValue: Number,
    quantity: Number,
    nbUsable: Number,
});
const schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        //required: true,
    },
    name: String,
    description: String,
    providerId: Schema.Types.ObjectId,
    brand: String,
    eanOrigin: String,
    categoryId: String,
    discount: {
        type: schemaDiscount,
        //required: true,
    },
    eanList: [String],
    quantityMinToSend: Number,
    quantityMaxToSend: Number,
    pathImg: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
})

const Offer = connection.model('Offer', schema);
const list = Offer.find()
// console.log(list.then(res => console.log(res)));
const offer = new Offer();
// offer.save((err) => {
//     console.log(err);
// })

const one = Offer.findById("5af81bc0d3ce6c73dac35764").exec()
console.log(one.then(res => console.log(res)));