// Provide API.
window.System = window.System || {};


function defineValue(root, n, defaultValue) {
    var iN = '___' + n;
    root[iN] = defaultValue;
    Object.defineProperty(root, n, {
        get: function () {
            return this[iN];
        },
        set: function (v) {
            if (v !== this[iN]) {
                var old = this[iN];
                this[iN] = v;
                if (this.vce) this.vce.dispatch(this, n, old, v);
            }
        }
    });
}


function uuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return "id" + S4() + S4() + S4() + S4() + S4() + S4();
}


var TYPE = {};
function CE(t, n) {
    function e() {
    }

    var i = t.prototype.type;
    e.prototype = n.prototype, t.sc_ = n.prototype, t.prototype = new e(), t.prototype.constructor = t,
    i && (TYPE[i] = t, t.prototype.type = i);
}
function CS(t, n, e) {
    var i = arguments.callee.caller;
    if (i.sc_) return i.sc_.constructor.apply(t, Array.prototype.slice.call(arguments, 1));
    for (var r = Array.prototype.slice.call(arguments, 2), o = !1, c = t.constructor; c; c = c.sc_ && c.sc_.constructor) if (c.prototype[n] === i) o = !0; else if (o) return c.prototype[n].apply(t, r);
    return t[n] === i ? t.constructor.prototype[n].apply(t, r) : void 0;
}



 

//# sourceURL=file://js/core/system/system.js