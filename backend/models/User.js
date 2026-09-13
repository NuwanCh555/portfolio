const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type:     String,
      required: true,
      unique:   true,
      lowercase: true,
      trim:     true,
      match:    [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    // Password reset
    resetPasswordToken:   { type: String, select: false },
    resetPasswordExpires: { type: Date,   select: false },
    // Profile
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare entered password
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password)
}

module.exports = mongoose.model('User', userSchema)
