require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const Contact = require("./models/contact")



const app = express()


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("dist"))


morgan.token("body", (req) =>{
    return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))


app.get("/api/persons",(request, response)=>{
    Contact.find({}).then(contacts =>{

        response.json(contacts)
    })

})

app.get("/info", (request, response) =>{
    const recivedRequest = new Date()
    response.send(`
        <p>Phonebook has info for ${phonebook.length} people </p>
        <p>${recivedRequest}</p>
    ` )
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = phonebook.find(person => person.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) =>{
    const id = request.params.id
    phonebook = phonebook.filter(person => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) =>{
    const body = request.body
 
    if(!body.name || !body.number){
       return response.status(404).json({
            error: "Content missing"
        })
    }

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    contact.save().then(savedContact =>{
        response.json(savedContact)
    })

})

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})