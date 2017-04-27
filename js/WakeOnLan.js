/**
 * Created by adam on 2017/4/27.
 */

import dgram from 'react-native-udp'
import { Buffer } from 'buffer'

const createMagicPacket = exports.createMagicPacket = function (mac) {
  const MAC_LENGTH = 0x06
  const MAC_REPEAT = 0x16
  const PACKET_HEADER = 0x06
  const parts = mac.match(/[0-9a-fA-F]{2}/g)
  if (!parts || parts.length !== MAC_LENGTH) { throw new Error('malformed MAC address \'' + mac + '\'') }
  let buffer = new Buffer(PACKET_HEADER)
  const bufMac = new Buffer(parts.map(function (p) {
    return parseInt(p, 16)
  }))
  buffer.fill(0xff)
  for (let i = 0; i < MAC_REPEAT; i++) {
    buffer = Buffer.concat([buffer, bufMac])
  }
  return buffer
}
/**
 * [wake on lan]
 * @param  {[type]}   mac      [description]
 * @param  {[type]}   options  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
const wake = function wake (mac, options, callback) {
  options = options || {}
  if (typeof options === 'function') {
    callback = options
  }
  const defaults = {
    address: '255.255.255.255',
    port: 9
  }
  for (let k in options) {
    defaults[k] = options[k]
  }
  options = defaults
  // create magic packet
  const magicPacket = createMagicPacket(mac)
  const socket = dgram.createSocket('udp4').on('error', function (err) {
    socket.close()
    callback && callback(err)
  }).once('listening', function () {
    socket.setBroadcast(true)
  })
  socket.send(
    magicPacket, 0, magicPacket.length,
    options.port, options.address, function (err, res) {
      callback && callback(err, res === magicPacket.length)
      socket.close()
    })
}

export default wake
