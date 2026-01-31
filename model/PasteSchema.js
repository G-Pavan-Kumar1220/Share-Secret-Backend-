const mongoose = require('mongoose')


const PasteSchema = new mongoose.Schema({
content: { type: String, required: true },
createdAt: { type: Number, required: true },
expiresAt: { type: Number, default: null },
maxViews: { type: Number, default: null },
views: { type: Number, default: 0 }
})


module.exports = mongoose.model('Paste', PasteSchema)