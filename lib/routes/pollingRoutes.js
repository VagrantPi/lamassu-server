const express = require('express')
const nmd = require('nano-markdown')
const _ = require('lodash/fp')

const router = express.Router()

const version = require('../../package.json').version

function poll (req, res) {
  return res.json({ version })
}

router.get('/', poll)

module.exports = router
