var ___globalScene = [];// used inside this file only.
var ___globalPicked = [];// used inside this file only.

var sceneChangedEvt = new signals.Signal();
var pickedChangedEvt = new signals.Signal();

// picked:
function pickModel(model, shouldAppend/*default false*/) {
    if (shouldAppend === true) {
        var isAdded = ArrayPushIfNotHas(___globalPicked, model);
        if (isAdded)pickedChangedEvt.dispatch(___globalPicked, "add", model);
    } else {
        ___globalPicked.forEach(function (picked) {
            pickedChangedEvt.dispatch(___globalPicked, "remove", picked);
        });
        ___globalPicked = [];
        if (model) {
            ___globalPicked.push(model);
            pickedChangedEvt.dispatch(___globalPicked, "add", model);
        }
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
function sceneReset() {
    pickModel();
    ___globalScene.forEach(function (model) {
        sceneRemoveModel(model);
    });
    ___globalPicked = [];
    ___globalScene = [];
}