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

const statSchema = new mongoose.Schema({
  val: { type: String, required: true },
  label: { type: String, required: true }
})

const coreObjectiveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String } // e.g. 'ph-code'
})

const skillItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true }
})

const skillCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, required: true },
  skills: [skillItemSchema],
  tags: [{ type: String }]
})

const portfolioSchema = new mongoose.Schema(
  {
    about: { type: String, default: '' },
    stats: [statSchema],
    coreObjectives: [coreObjectiveSchema],
    skillCategories: [skillCategorySchema],
    skills: [{ type: String }],
    experience: [experienceSchema],
    technicalArsenal: [technicalArsenalSchema],
    cvUrl: { type: String, default: '' },
    profilePhotoUrl: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Portfolio', portfolioSchema)
