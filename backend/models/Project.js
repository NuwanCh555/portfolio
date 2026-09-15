const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 500 },
    category:    { type: String, enum: ['web', 'security', 'design'], required: true },
    tech:        [{ type: String, trim: true }],
    icon:        { type: String, default: 'ph-terminal-window' }, // Phosphor icon name
    image:       { type: String, default: '' }, // Project screenshot URL
    featured:    { type: Boolean, default: false },
    order:       { type: Number,  default: 0 },
    liveUrl:     { type: String,  default: '' },
    repoUrl:     { type: String,  default: '' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Project', projectSchema)
