const crypto = require('crypto')
const moment = require('moment')

// TODO - Manage time offset with a request to retrieve server time
/**
 * @param {string} secret - The secret to use for the token.
 * @param {number} validTimeSeconds - The number of seconds the token is valid for.
 * @param {number} length - The length of the token between 1 and 32.
 */
module.exports = function (secret, validTimeSeconds, length) {
  if (length < 1 || length > 32) {
    throw new Error('length must be between 1 and 32')
  }

  const timestamp = moment().unix()
  const secretTimeBase = timestamp - timestamp % validTimeSeconds

  return crypto
    .createHash('md5')
    .update(`${secret}-${secretTimeBase}`)
    .digest('hex')
    .slice(0, length)
}
