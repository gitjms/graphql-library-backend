const {
  UserInputError, AuthenticationError, PubSub
} = require('apollo-server')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const config = require('../utils/config')
const Author = require('../models/author')
const Book = require('../models/book')
const User = require('../models/user')

const JWT_SECRET = config.SECRET

const pubsub = new PubSub()

const password_strength = (password) => {
  const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
  const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')

  if(strongRegex.test(password)) {
    logger.info('password strength is strong')
  } else if(mediumRegex.test(password)) {
    logger.info('password strength is medium')
  } else {
    logger.info('password strength is weak')
  }
}

  const resolvers = {
    Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        if (args.author && args.genre) {
          author = await Author.findOne({ name: args.author }).populate('books')
          return await Book.find({ author: { $in: author._id }})
            .find({ genres: { $in: [args.genre] }}).populate('author')
        } else if (args.author) {
          author = await Author.findOne({ name: args.author }).populate('books')
          return await Book.find({ author: { $in: author._id }}).populate('author')
        } else if (args.genre) {
          return await Book.find({ genres: { $in: [args.genre] }}).populate('author')
        } 
        return Book.find({}).populate('author')
      },
      allAuthors: () => Author.find({}).populate('books'),
      me: async (root, args, context) => {
        return await User.findOne({ username: { $in: context.currentUser.username } })
      },
      favorites: async (root, args, context) =>
        await Book.find(
          { genres: { $in: [context.currentUser.favoriteGenre] }})
          .populate('author')
    },
    User: {
      username: (root) => root.username,
      favoriteGenre: (root) => root.favoriteGenre,
      passwordHash: (root) => root.passwordHash
    },
    Book: {
      title: (root) => root.title,
      author: async (root) => await Author.findOne({ _id: root.author }).populate('books'),
      published: (root) => root.published,
      genres: (root) => root.genres
    },
    Author:  {
      name: (root) => root.name,
      born: (root) => root.born,
      books: async (root) => await Book.find({ author: root._id }).populate('books'),
      bookCount: (root) => root.books.length
    },
    Mutation: {
      createUser: async (root, args) => {
        password_strength(args.password)
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(args.password, saltRounds)

        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
          passwordHash
        })

        await user.save().catch(error => {
            logger.error('error: ', error.message)
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
        })
        const newUser = await User.findOne({ username: args.username })
    
        const userForToken = {
          username: newUser.username,
          id: newUser._id,
        }

        return { value: jwt.sign(userForToken, JWT_SECRET) }
      },
  
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
        const passwordCorrect = user === null
          ? false
          : await bcrypt.compare(args.password, user.passwordHash)
      
        if (!(user && passwordCorrect)) {
          throw new UserInputError("wrong credentials")
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }

        return { value: jwt.sign(userForToken, JWT_SECRET) }
      },
  
      addBook: async (root, args, context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }
  
        if (! await Book.exists({ title: args.title })) {
          if (! await Author.exists({ name: args.author })) {
            const author = new Author({
              name: args.author,
              born: null
            })
            try {
              await author.save()
            } catch (error) {
              logger.error('error: ', error.message)
              throw new UserInputError(error.message, {
                invalidArgs: args,
              })
            }
          }
  
          const author = await Author.findOne({ name: args.author }).populate('books')
          const book = new Book({
            title: args.title,
            author: author._id,
            published: Number(args.published),
            genres: args.genres
          })
          try {
            const newBook = await book.save()
            author.books = author.books.concat(newBook._id)
            await author.save()
          } catch (error) {
            logger.error('error: ', error.message)
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          }

          pubsub.publish('BOOK_ADDED', { bookAdded: book })

          return book
        }
      },
  
      editAuthor: async (root, args, context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }
  
        const author = await Author.findOne({ name: { $in: args.name }})

        if (author) {
          await Author.updateOne(author, { $set: { born: args.setBornTo }})
          const editedAuthors = await Author.find({}).populate('books')

          pubsub.publish('AUTHOR_EDITED', { authorEdited: editedAuthors })

          return editedAuthors
        } else {
          return null
        }
      }
    },

    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
      },

      authorEdited: {
        subscribe: () => pubsub.asyncIterator(['AUTHOR_EDITED'])
      }
    }
  }

  module.exports = resolvers