var wipe = module.exports

wipe.Writer = require( './writer' )
wipe.ZeroFill = require( './zerofill' )
wipe.createZeroFill = (options) => {
  return new wipe.ZeroFill(options)
}
