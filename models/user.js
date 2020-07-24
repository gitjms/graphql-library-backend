const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    uniqueCaseInsensitive: true
  },
  favoriteGenre: String,
  passwordHash: String
})
userSchema.plugin(require('mongoose-beautiful-unique-validation'))

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)
