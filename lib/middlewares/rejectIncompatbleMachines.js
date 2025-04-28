const semver = require('semver')
const version = require('../../package.json').version
const logger = require('../logger')

const rejectIncompatibleMachines = function (req, res, next) {
  const machineVersion = req.query.version
  const deviceId = req.deviceId

  if (!machineVersion) return next()

  const serverMajor = semver.major(version)
  const machineMajor = semver.major(machineVersion)

  if (serverMajor - machineMajor > 1) {
    logger.error(`Machine version too old: ${machineVersion} deviceId: ${deviceId}`)
    return res.status(400).json({
      error: 'Machine version too old'
    })
  }

  if (serverMajor < machineMajor) {
    logger.error(`Machine version too new: ${machineVersion} deviceId: ${deviceId}`)
    return res.status(400).json({
      error: 'Machine version too new'
    })
  }

  next()
}

module.exports = rejectIncompatibleMachines