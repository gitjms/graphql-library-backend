// const bookRouter = require('express').Router()
// const Book = require('../models/book')
// const logger = require('../utils/logger')

// bookRouter.get('/', async (request, response) => {
//   const books = await Book.find({})
//     .populate('author', { name: 1, born: 1 })
//   response.json(books.map(book => ({
//     title: book.title,
//     author: book.author,
//     published: book.published,
//     genres: book.genres,
//     id: book.id
//   })))
// })

// bookRouter.get('/:id', async (request, response) => {
//   const book = await Book.findById(request.params.id)
//   if (book) {
//     response.json(book.toJSON())
//   } else {
//     response.status(404).end()
//   }
// })

// bookRouter.post('/', async (request, response) => {
//   const body = request.body

//   const book = new Book({
//     title: body.title,
//     author: body.author,
//     published: Number(body.published),
//     genres: body.genres
//   })

//   const savedBook = await book.save()
//   response.json(savedBook.toJSON())
// })

// bookRouter.delete('/:id', async (request, response) => {
//   await Book.findByIdAndRemove(request.params.id)
//   response.status(204).end()
// })

// bookRouter.put('/:id', async (request, response) => {
//   const body = request.body

//   const book = {
//     title: body.title,
//     author: body.author,
//     published: Number(body.published),
//     genres: body.genres
//   }

//   const bookToUpdate = await Author.findByIdAndUpdate(request.params.id, book, { new: true })

//   const returnedBook ={
//     id: bookToUpdate.id,
//     title: bookToUpdate.title,
//     author: bookToUpdate.author,
//     published: Number(bookToUpdate.published),
//     genres: bookToUpdate.genres
//   }

//   response.json(returnedBook)
// })

// module.exports = bookRouter