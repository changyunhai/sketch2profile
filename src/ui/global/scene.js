var ___globalScene = [];// used inside this file only.
var ___globalPicked = [];// used inside this file only.

var sceneChangedEvt = signals.Signal();
var pickedChangedEvt = signals.Signal();

// picked:
function pickModel(model, shouldAppend/*default false*/) {
    if (shouldAppend === true) {
        var isAdded = ArrayPushIfNotHas(___globalPicked, model);
        if (isAdded)pickedChangedEvt.dispatch(___globalPicked);
    } else {
        ___globalPicked = [];
        if (model)___globalPicked.push(model);
        pickedChangedEvt.dispatch(___globalPicked);
    }
}
function pickedModel() {
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
    ___globalScene.splice(idx, 0);
    sceneChangedEvt.dispatch(___globalScene, "remove", model);
}
function sceneAllModels() {
    return ___globalScene;
}