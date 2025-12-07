const mongoose = require("mongoose")

if(process.argv.length < 3){
    console.log("You didn't enter all required items")
    process.exit(1)
}else if(process.argv.length > 5){
    console.log("Too many elements")
    process.exit(1)
}else if (process.argv.length === 4){
    console.log("Inputed elements are not in right form")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.asns3ok.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)
mongoose.connect(url, {family:4})

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model("Contact", contactSchema)

if(process.argv.length === 3){

    
    Contact.find({}).then(result =>{
        result.forEach(contact =>{
            console.log(`${contact.name} ${contact.number}`)
            mongoose.connection.close()
        })
    })

}else if(process.argv.length === 5){

    const name = process.argv[3]
    const number = process.argv[4]

    const contact = new Contact({
        name: name,
        number: number
    })

    contact.save().then(result =>{
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}



