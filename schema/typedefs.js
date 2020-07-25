const {gql} = require('apollo-server')//-express')

const typeDefs = gql`
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]! 
    id: ID!
  }
  
  type Author {
    name: String!
    born: Int
    books: [Book]!
    bookCount: Int
    id: ID!
  }
  
  type Token {
    value: String!
  }
  
  type User {
    username: String!
    favoriteGenre: String!
    passwordHash: String!
  }
  
  type Subscription {
    bookAdded: Book!
    authorEdited: [Author!]!
  }
  
  type Query {
    me: User
    favorites: [Book]
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allGenres: [String]
  }
  
  type Mutation {
    createUser(
      username: String!
      favoriteGenre: String!
      password: String!
    ): Token
  
    login(
      username: String!
      password: String!
    ): Token
  
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
  
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
  `
  module.exports = typeDefs