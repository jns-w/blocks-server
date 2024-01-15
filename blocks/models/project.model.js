const mongoose = require('mongoose')

const {Schema} = mongoose

const projectSchema = new Schema(
  {
    id: {type: String, required: true},
    name: {type: String, required: true},
    description: String,
    blocks: []
  }
)

const Project = mongoose.model('Project', projectSchema)

module.exports = Project