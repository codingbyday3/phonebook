
const mongoose = require("mongoose")
const { validate } = require("../../hello/models/note")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI
console.log("Conecting to", url)

mongoose.connect(url, {family:4})
    .then(response =>{
        console.log("Connected to MongoDB")
    })
    .catch(error =>{
        console.log("Something went wrong. Response:", error)
    })

const contactSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number`
        },
        minLength:8,
        required: true
    },
})

contactSchema.set("toJSON", {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Contact", contactSchema)

