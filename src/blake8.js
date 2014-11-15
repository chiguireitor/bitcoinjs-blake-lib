var Module = require('./blake.js')

function blake8_string(data) {
    var src = Module.allocate(Module.intArrayFromString(data), 'i8', Module.ALLOC_STACK)
    var dst = Module.allocate(32, 0, Module.ALLOC_STACK)
    
    Module._blake8(src, data.length, dst)
    
    var ret = Module.Pointer_stringify(dst)
    
    /*Module._free(src)
    Module._free(dst)*/
    
    return new Buffer(ret)
}

/*function blake8_intarr(data) {
    var src = allocate(intArrayFromString(data), 'i8', ALLOC_STACK)
    var dst = allocate(32, 0, ALLOC_STACK)
    
    _blake8(src, data.length, dst)
    
    var n = []
    for (var x=0; x < 32; x++) {
        n.push(getValue(dst+x, "i8") & 0xFF)
    }
    
    return n
}

function bintohex(data) {
    return data.map(function (x) {
        x = x + 0xFFFFFFFF + 1;  // twos complement
        x = x.toString(16); // to hex
        x = ("00"+x).substr(-2); // zero-pad to 2-digits
        return x
    }).join('')
}

function blake8_hexstr(data) {
    return bintohex(blake8_intarr(data))
}

function bintoarr(data) {
    var arr = []
    for (var i=0; i < data.length; i++) {
        arr.push(data.charCodeAt(i))
    }
    
    return arr
}*/

module.exports = blake8_string