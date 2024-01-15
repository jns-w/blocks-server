const mongoose = require('mongoose')

const {Schema} = mongoose

const blockSchema = new Schema(
  {
    name: {type: String, required: true},
    targetDuration: {type: Number},
    duration: {type: Number, default: 0},
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },
    status: {
      type: String,
      enum: ['off', 'on', 'paused']
    },
    logbook: [
      {
        start: Date,
        end: Date
      }
    ]
  }
)

const Block = mongoose.model('Block', blockSchema)

module.exports = Block

// should we include timestamps of every start / stop?