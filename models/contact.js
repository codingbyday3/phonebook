
const mongoose = require("mongoose")

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
    name: String,
    number: String,
})

contactSchema.set("toJSON", {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Contact", contactSchema)

