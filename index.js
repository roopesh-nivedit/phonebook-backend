const express = require("express");
const app = express();
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json());

app.use(express.static('build'))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'));

morgan.token("json", function(req, res) {
  return JSON.stringify(req.body)
})

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const phonebookSize = persons.length;
  const requestTime = new Date().toString();
  response.send(
    "<p>Phonebook has info for " +
      phonebookSize +
      " people</p><p>" +
      requestTime +
      "</p>"
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const id = Math.floor(Math.random() * 5000);
  return id;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "Name is missing",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "Number is missing",
    });
  } else if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
