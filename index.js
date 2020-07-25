const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const cors = require('cors')
const path = require('path')
const http = require('http')
const typeDefs = require('./schema/typedefs')
const resolvers = require('./schema/resolvers')

const jwt = require('jsonwebtoken')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const User = require('./models/user')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const JWT_SECRET = config.SECRET
const MONGODB_URI = config.MONGODB_URI

const app = express()
app.use(cors())
app.use(express.static('build'))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://graphql-library-jms.herokuapp.com"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next()
})

logger.info('connecting to', MONGODB_URI)

mongoose.connect( MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  engine: {    
    reportSchema: true
  },
  playground: process.env.NODE_ENV !== 'production',
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
// server.applyMiddleware({ app })
server.applyMiddleware({
  path: '/', // you should change this to whatever you want
  app,
})

const PORT = Number(config.PORT || 4000)
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer)

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  logger.info(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  logger.info(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})

// server.listen({ port: config.PORT || 4000 }).then(({ url, subscriptionsUrl }) => {
//   console.log(`Server ready at ${url}`)
//   console.log(`Subscriptions ready at ${subscriptionsUrl}`)
// })

// app.listen(3000, () => {
//   console.log('Go to http://localhost:3000/graphiql to run queries!');
// })
