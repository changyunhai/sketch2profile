var click = "click";
var keydown = "keydown";
var keypress = "keypress";
var keyup = "keyup";
var change = "change";

var MODELFLAG_PICKED = 1 << 1;
var MODELFLAG_HIDDEN = 1 << 2;
var MODELFLAG_LOCKED = 1 << 3;
var MODELFLAG_FORCE_UPDATE = 1 << 4;

function ArrayPushIfNotHas(arr, element) {
    if (arr && element && arr.indexOf(element) == -1) {
        arr.push(element);
        return true;
    } else return false;
}

function getParameterByName(name) {
    if (!location || !location.search) return undefined;
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}


//# sourceURL=file://ui/global/constant.js