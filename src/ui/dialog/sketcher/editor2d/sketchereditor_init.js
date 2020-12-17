var SketcherEditor_svg = undefined;// important......


function initSketcherEditor() {
    var dom = document.getElementById("sketcherEditDialogSvg");
    var canvas = view2d = SketcherEditor_svg = new SketcherEditorCanvas(dom, {name: "SketcherEditor"});
    sceneChangedEvt.add(sceneChangeEvtHandler);
    SketcherEditor_svg.zoomChangedEvent.add(function (view, viewport, factor, totalFactor) {
        SketcherEditor_svg.fitByZoom(view);
    });
}

function sketcherEditorCreateViewObject(view, model) {
    var svgObjectType = undefined;
    if (model instanceof Curve) {
        svgObjectType = SketcherEditorCurve;
    } else if (model instanceof Loop) {
        svgObjectType = SketcherEditorLoop;
    } else {
        console.error("Unknown model type!");
        return;
    }
    console.assert(view.viewObjects[model.id] == undefined);

    if (!svgObjectType) return;
    var svgObject = new svgObjectType(view, model);
    svgObject.create(), svgObject.update();
    return svgObject;
}

function sceneChangeEvtHandler(scene, op, model) {
    if (!SketcherEditor_svg || !model) {
        return;
    }
    var svgObject = SketcherEditor_svg.viewObjects[model.id];
    if (op == "add" && !svgObject) {
        svgObject = sketcherEditorCreateViewObject(SketcherEditor_svg, model);
        if (svgObject) SketcherEditor_svg.viewObjects[model.id] = svgObject;
    } else if (op == "remove" && svgObject) {
        svgObject.destroy();
        delete SketcherEditor_svg.viewObjects[model.id];
    } else {
        console.warn("scene change warning: " + op);
    }
}
