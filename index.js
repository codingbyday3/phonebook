const express = require("express")
const morgan = require("morgan")


const app = express()


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("dist"))


let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token("body", (req) =>{
    return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

const generateId = () => {
    const randomId = Math.floor(Math.random()*100000000)
    return String(randomId) 
}

const isUnique = (name) =>{
    return phonebook.some(person => person.name === name)
}


app.get("/api/persons",(request, response)=>{
    response.json(phonebook)
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
    }else if(isUnique(body.name)){
        return response.status(404).json({
            error: "Name must be unique"
        })
    }

    const contact = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    phonebook = phonebook.concat(contact)

    response.json(contact)
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})