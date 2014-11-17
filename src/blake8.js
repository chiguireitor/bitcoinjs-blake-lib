var Module = require('./blake.js')

function blake8_string(data) {
    //var src = Module.allocate(Module.intArrayFromString(data), 'i8', Module.ALLOC_STACK)
    
    var src = Module._malloc(data.length)
    
    for (var i=0; i < data.length; i++) {
        Module.setValue(src + i, data[i])
    }
    
    var dst = Module.allocate(32, 0, Module.ALLOC_STACK)
    
    Module._blake8(src, data.length, dst)
    
    var ret = []
    
    for (var i=0; i < 32; i++) {
        ret.push(Module.getValue(dst + i, 'i8'))
    }
    
    Module._free(src)
    
    return new Buffer(ret)
}

function HmacBlake8(buffer, secret) {
    var src = Module.allocate(Module.intArrayFromString(buffer), 'i8', Module.ALLOC_STACK)
    var key = Module.allocate(Module.intArrayFromString(secret), 'i8', Module.ALLOC_STACK)
    var dst = Module.allocate(32, 0, Module.ALLOC_STACK)
    
    Module._hmac_blake8(src, buffer.length, key, secret.length, dst)
    
    var ret = []
    
    for (var i=0; i < 32; i++) {
        ret.push(Module.getValue(dst + i, 'i8'))
    }
    
    return new Buffer(ret)
}

function HmacBlake8_old(buffer, secret) {
    var ipad = new Buffer(Array.apply(null, new Array(64)).map(function(){ return 0x36 }))
    var opad = new Buffer(Array.apply(null, new Array(64)).map(function(){ return 0x5c }))
    
    if (secret.length > 64) {
        secret = blake8_string(secret)
    }
    
    for (var i=0; i < secret.length; i++) {
        ipad[i] ^= secret[i]
        opad[i] ^= secret[i]
    }
    
    var tbuf = Buffer.concat([opad, blake8_string(Buffer.concat([ipad, buffer]))])
    
    console.log(tbuf)
    
    return blake8_string(tbuf)
}

module.exports = {
    blake8: blake8_string,
    hmacBlake8: HmacBlake8_old,
    hmacBlake8_old: HmacBlake8_old
}