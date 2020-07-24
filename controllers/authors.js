// const authorRouter = require('express').Router()
// const Author = require('../models/author')

// authorRouter.get('/', async (request, response) => {
//   const authors = await Author.find({})
//   response.json(authors.map(author => ({
//     name: author.name,
//     born: author.born,
//     bookCount: author.bookCount,
//     id: author.id
//   })))
// })

// authorRouter.get('/:id', async (request, response) => {
//   const author = await Author.findById(request.params.id)
//   if (author) {
//     response.json(author.toJSON())
//   } else {
//     response.status(404).end()
//   }
// })

// authorRouter.post('/', async (request, response) => {
//   const body = request.body

//   const author = new Author({
//     name: body.name,
//     born: body.born,
//     bookCount: Number(body.bookCount)
//   })

//   const savedAuthor = await author.save()
//   response.json(savedAuthor.toJSON())
// })

// authorRouter.delete('/:id', async (request, response) => {
//   const author = await Author.findById(request.params.id)
//   blog.deleteOne()
//   response.status(204).end()
// })

// authorRouter.put('/:id', async (request, response) => {
//   const body = request.body

//   const author = {
//     name: body.name,
//     born: body.born,
//     bookCount: Number(body.bookCount)
//   }

//   const authorToUpdate = await Author.findByIdAndUpdate(request.params.id, author, { new: true })

//   const returnedAuthor ={
//     id: authorToUpdate.id,
//     name: authorToUpdate.name,
//     born: authorToUpdate.born,
//     bookCount: Number(authorToUpdate.bookCount)
//   }

//   response.json(returnedAuthor)
// })

// module.exports = authorRouter