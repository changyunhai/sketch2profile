var ___globalScene = [];// used inside this file only.
var ___globalPicked = [];// used inside this file only.

var sceneChangedEvt = new signals.Signal();
var pickedChangedEvt = new signals.Signal();

var view2d = undefined;

// picked:
function unpickModel(model) {
    var idx = ___globalPicked.indexOf(model);
    if (idx == -1)return;
    ___globalPicked.splice(idx, 1);
    pickedChangedEvt.dispatch(___globalPicked, "remove", model);
}
function pickModel(model, shouldAppend/*default false*/) {
    if (shouldAppend === true) {
        var isAdded = ArrayPushIfNotHas(___globalPicked, model);
        if (isAdded)pickedChangedEvt.dispatch(___globalPicked, "add", model);
    } else {
        for (var i = ___globalPicked.length - 1; i >= 0; i--) unpickModel(___globalPicked[i]);
        console.assert(___globalPicked.length == 0);
        if (model) {
            ___globalPicked.push(model);
            pickedChangedEvt.dispatch(___globalPicked, "add", model);
        }
    }
}
function pickedModels() {
    return ___globalPicked;
}

// scene:
function sceneAddModel(model) {
    var isAdded = ArrayPushIfNotHas(___globalScene, model);
    if (isAdded)sceneChangedEvt.dispatch(___globalScene, "add", model);
}
function sceneRemoveModel(model) {
    var idx = ___globalScene.indexOf(model);
    if (idx == -1)return;
    ___globalScene.splice(idx, 1);
    sceneChangedEvt.dispatch(___globalScene, "remove", model);
}
function sceneAllModels() {
    return ___globalScene;
}
function sceneReset() {
    pickModel();
    ___globalScene.forEach(function (model) {
        sceneRemoveModel(model);
    });
    ___globalPicked = [];
    ___globalScene = [];
}