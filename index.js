//ApolloServer class from the apollo server package is used to create server
//startStandaloneServer is used to create server that serves frontend client
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

let persons = [
  {
    name: 'Arto Hellas',
    phone: '040-123543',
    street: 'Tapiolankatu 5 A',
    city: 'Espoo',
    id: '3d594650-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Matti Luukkainen',
    phone: '040-432342',
    street: 'Malminkaari 10 A',
    city: 'Helsinki',
    id: '3d599470-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Venla Ruuska',
    street: 'Nallemäentie 22 C',
    city: 'Helsinki',
    id: '3d599471-3436-11e9-bc57-8b80ba54c431',
  },
]

const typeDefs = `
  type Address {
    street:String!
    city:String!
  }

  type Person {
    name: String!
    phone: String
    address:Address!
    id: ID!
  }

  enum YesNo{
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone:YesNo): [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name:String!
      phone:String
      street:String!
      city:String!
    ):Person
    editPerson(
      name:String!
      phone:String!
    ):Person
  }
`
//resolvers is needed to resolve the defined schema object field path
//these are code which define how queries are responded to
const resolvers = {
  Query: {
    //personCount query resolves to function returning person length
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if (!args.phone) {
        //console.log(args.phone)
        return persons
      }
      //console.log(args)
      const byPhone = (person) =>
        args.phone === 'YES' ? person.phone : !person.phone

      const out = persons.filter(byPhone)
      console.log(out)

      return out
    },
    findPerson: (root, args) => persons.find((p) => p.name.toLowerCase() === args.name.toLowerCase()),
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      }
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name.toLowerCase() === args.name.toLowerCase())) {
        throw new GraphQLError('Name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    },
    editPerson: (root, args) => {
      const person = persons.find((p) => p.name.toLowerCase() === args.name.toLowerCase())
      if (!person) return null
      const updatedPerson = { ...person, phone: args.phone }
      //console.log(person)
      persons = persons.map((p) => (p.name.toLowerCase() === args.name.toLowerCase() ? updatedPerson : p))
      return updatedPerson
    },
  },
}
// server is created using ApolloServer which takes typedefs(schema as string)  and resolver is an object
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
