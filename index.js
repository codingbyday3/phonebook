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


app.get("/api/persons",(request, response, next)=>{
    Contact.find({})
        .then(contacts =>{
            response.json(contacts)
        })
        .catch(error => next(error))

})

app.get("/api/persons/:id", (request, response, next) => {

    Contact.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))

})

app.delete("/api/persons/:id", (request, response, next) =>{

    Contact.findByIdAndDelete(request.params.id)
        .then(result =>{
            response.status(204).end()
        })
        .catch(error => next(error))

})

app.post("/api/persons", (request, response, next) =>{
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

    contact.save()
        .then(savedContact =>{
            response.json(savedContact)
        })
        .catch(error => next(error))

})

app.put("/api/persons/:id", (request, response, next)=>{
    const {name, number} = request.body

    Contact.findById(request.params.id)
        .then(person =>{    
            if(!person){
                response.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then(updatedPerson =>{
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: String(error) })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})