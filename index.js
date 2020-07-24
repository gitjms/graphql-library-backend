const { ApolloServer } = require('apollo-server')

const jwt = require('jsonwebtoken')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const User = require('./models/user')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const JWT_SECRET = config.SECRET
const MONGODB_URI = config.MONGODB_URI

logger.info('connecting to', MONGODB_URI)

mongoose.connect( MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const typeDefs = require('./graphql/typedefs')
const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  engine: {    
    reportSchema: true
  },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )

      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
