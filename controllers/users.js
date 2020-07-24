// const bcrypt = require('bcrypt')
// const userRouter = require('express').Router()
// const User = require('../models/user')
// const logger = require('../utils/logger')

// const password_strength = (password) => {
//   const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
//   const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')

//   if(strongRegex.test(password)) {
//     logger.info('password strength is strong')
//   } else if(mediumRegex.test(password)) {
//     logger.info('password strength is medium')
//   } else {
//     logger.info('password strength is weak')
//   }
// }

// userRouter.get('/', async (request, response) => {
//   const users = await User.find({})
//     // .populate('books', { title: 1, published: 1, author: 1, genres: 1 })
//   response.json(users.map(user => ({
//     username: user.username,
//     name: user.name,
//     // books: user.books.map(book => ({
//     //   title: book.title,
//     //   published: book.published,
//     //   author: book.author,
//     //   genres: book.genres,
//     //   id: blog.id
//     // })),
//     id: user.id
//   })))
// })

// userRouter.get('/:id', async (request, response) => {
//   const user = await User.findById(request.params.id)
//   if (user) {
//     response.json(user.toJSON())
//   } else {
//     response.status(404).end()
//   }
// })

// userRouter.post('/', async (request, response) => {
//   const body = request.body

//   if (!body.password) {
//     return response.status(400).json({
//       error: 'password is required'
//     })
//   } else if (body.password.length < 3) {
//     return response.status(400).json({
//       error: 'password length should be at least 3 characters'
//     })
//   }

//   password_strength(body.password)

//   const saltRounds = 10
//   const passwordHash = await bcrypt.hash(body.password, saltRounds)

//   const user = new User({
//     username: body.username,
//     name: body.name,
//     passwordHash,
//   })

//   const savedUser = await user.save()

//   response.json(savedUser)
// })

// userRouter.delete('/:id', async (request, response) => {
//   await User.findByIdAndRemove(request.params.id)
//   response.status(204).end()
// })

// module.exports = userRouter