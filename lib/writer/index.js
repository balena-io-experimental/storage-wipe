/*
 * Copyright 2017 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const stream = require('readable-stream')
const BlockWriteStream = require('./block-write-stream')
const debug = require('debug')('image-writer')
const EventEmitter = require('events').EventEmitter

/**
 * @summary ImageWriter class
 * @class
 */
class ImageWriter extends EventEmitter {
  /**
   * @summary ImageWriter constructor
   * @param {Object} options - options
   * @example
   * new ImageWriter(options)
   */
  constructor (options) {
    super()

    this.options = options

    this.source = null
    this.pipeline = null
    this.target = null

    this.hadError = false

    this.bytesRead = 0
    this.bytesWritten = 0
    this.checksum = {}
  }

  /**
   * @summary Start the writing process
   * @returns {ImageWriter} imageWriter
   * @example
   * imageWriter.write()
   */
  write () {
    this.hadError = false

    this._createWritePipeline(this.options)
      .on('error', (error) => {
        this.hadError = true
        this.emit('error', error)
      })

    this.target.on('finish', () => {
      this.bytesRead = this.source.bytesRead
      this.bytesWritten = this.target.bytesWritten
      this._emitFinish()
    })

    return this
  }

  /**
   * @summary Abort the flashing process
   * @example
   * imageWriter.abort()
   */
  abort () {
    if (this.source) {
      this.emit('abort')
      this.source.destroy()
    }
  }

  /**
   * @summary Emits the `finish` event with state metadata
   * @private
   * @example
   * this._emitFinish()
   */
  _emitFinish () {
    this.emit('finish', {
      bytesRead: this.bytesRead,
      bytesWritten: this.bytesWritten,
      checksum: this.checksum
    })
  }

  /**
   * @summary Creates a write pipeline from given options
   * @private
   * @param {Object} options - options
   * @param {Object} options.image - source image
   * @param {Number} [options.fd] - destination file descriptor
   * @param {String} [options.path] - destination file path
   * @param {String} [options.flags] - destination file open flags
   * @param {String} [options.mode] - destination file mode
   * @returns {Pipage} pipeline
   * @example
   * this._createWritePipeline({
   *   image: sourceImage,
   *   path: '/dev/rdisk2'
   * })
   */
  _createWritePipeline (options) {
    const image = options.image
    const source = image.stream

    const target = new BlockWriteStream({
      fd: options.fd,
      path: options.path,
      flags: options.flags,
      mode: options.mode,
      autoClose: true
    })

    this.source = source
    this.target = target

    return source.pipe(target)
  }
}

module.exports = ImageWriter
