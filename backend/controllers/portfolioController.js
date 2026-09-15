const Portfolio = require('../models/Portfolio')

// @desc    Get portfolio content
// @route   GET /api/portfolio
// @access  Public
const getPortfolio = async (req, res) => {
  try {
    // We only need one document for the single portfolio
    let portfolio = await Portfolio.findOne()
    if (!portfolio) {
      // If it doesn't exist yet, return an empty profile rather than 404
      portfolio = new Portfolio()
    }
    res.json({ success: true, data: portfolio })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update portfolio content
// @route   PUT /api/portfolio
// @access  Private/Admin
const updatePortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne()

    if (!portfolio) {
      // Create if it doesn't exist
      portfolio = new Portfolio(req.body)
      await portfolio.save()
      return res.status(201).json({ success: true, data: portfolio })
    }

    // Update existing
    // req.body can include about, skills, experience, technicalArsenal, etc.
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      portfolio._id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({ success: true, data: updatedPortfolio })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getPortfolio,
  updatePortfolio
}
