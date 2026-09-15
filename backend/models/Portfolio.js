const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  duration:    { type: String, required: true },
  description: { type: String }
})

const technicalArsenalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String } // e.g. 'ph-react' or a url
})

const portfolioSchema = new mongoose.Schema(
  {
    about: { type: String, default: '' },
    skills: [{ type: String }],
    experience: [experienceSchema],
    technicalArsenal: [technicalArsenalSchema],
    cvUrl: { type: String, default: '' },
    profilePhotoUrl: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Portfolio', portfolioSchema)
