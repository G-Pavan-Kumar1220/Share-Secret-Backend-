const express = require('express')
const Paste = require('../model/PasteSchema')
const { getNow } = require('../utils/time')

const router = express.Router()

// CREATE SECRET
router.post('/', async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body

    if (!content || typeof content !== 'string')
      return res.status(400).json({ error: 'Invalid content' })

    if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1))
      return res.status(400).json({ error: 'Invalid ttl_seconds' })

    if (max_views && (!Number.isInteger(max_views) || max_views < 1))
      return res.status(400).json({ error: 'Invalid max_views' })

    const now = Date.now()

    const paste = await Paste.create({
      content,
      createdAt: now,
      expiresAt: ttl_seconds ? now + ttl_seconds * 1000 : null,
      maxViews: max_views || null,
      views: 0
    })

    res.json({
      id: paste._id,
      url: `${process.env.BASE_URL}/p/${paste._id}`
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// FETCH SECRET
router.get('/:id', async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id)
    if (!paste) return res.status(404).json({ error: 'Not found' })

    const now = getNow(req)

    if (paste.expiresAt && now > paste.expiresAt)
      return res.status(404).json({ error: 'Expired' })

    if (paste.maxViews && paste.views >= paste.maxViews)
      return res.status(404).json({ error: 'View limit exceeded' })

    paste.views += 1
    await paste.save()

    res.json({
      content: paste.content,
      remaining_views: paste.maxViews
        ? Math.max(paste.maxViews - paste.views, 0)
        : null,
      expires_at: paste.expiresAt
        ? new Date(paste.expiresAt).toISOString()
        : null
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router