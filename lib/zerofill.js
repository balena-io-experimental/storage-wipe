var stream = require('readable-stream')

class ZerofillStream extends stream.Readable {

  constructor(options) {

    options = options || {}
    options.highWaterMark = 64 * 1024

    super(options)

    this.start = options.start
    this.end = options.end
    this.length = this.end - this.start
    this.toRead = this.length

  }

  _read(size) {

    size = size === undefined ?
      this._readableState.highWaterMark : size

    size = Math.max(0, Math.min(size, this.toRead))
    this.toRead -= size

    if(this.toRead <= 0) {
      process.nextTick(() => {
        this.push(null)
      })
      return
    }

    process.nextTick(() => {
      this.push(Buffer.alloc(size))
    })

  }

}

module.exports = ZerofillStream
