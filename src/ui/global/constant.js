var click = "click";
var keydown = "keydown";
var keypress = "keypress";
var keyup = "keyup";
var change = "change";

function ArrayPushIfNotHas(arr, element) {
    if (arr && element && arr.indexOf(element) == -1) {
        arr.push(element);
        return true;
    } else return false;
}