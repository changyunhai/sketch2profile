function SketcherEditorCanvas(dom, opt) {
    CS(this, dom, opt);

    this.createLayersOrder();
    this.init();

    this.viewBound = new Bound();
    this.viewBound.reset();

}

CE(SketcherEditorCanvas, View2dCanvasLayer);
Object.assign(SketcherEditorCanvas.prototype, {
    init: (function () {
        var aleradyInit = false;
        return function () {
            if (aleradyInit)return;
            CS(this, "init");
            utilBindSketcherEditorEvents(this);
            aleradyInit = true;
        }
    })(),
    createLayersOrder: function () {
        this.layersOrder.push(
            "BACKGROUND",
            "PROFILES",
            "CURVES",
            "POINTS",
            "GIZMOS",
            "DEBUG"
        );
    },
    show: function (scene) {
        this.clear();

        // step1: clear all existing layers:
        var layersName = Object.keys(this.layers);
        for (var i = 0; i < layersName.length; ++i) {
            var thislayer = this.layers[layersName[i]];
            thislayer.attr("display", "block");
            thislayer.clear();
        }
        this.viewBound.reset();
        // step2: create display:
        this.createDisplay(scene);

        // step3: fit:
        var viewBound = this.viewBound.addMarginClone(0.8, 0.8);
        viewBound.scale(100, 100);
        this.fit(viewBound);
    },
    createDisplay: function (models) {
        models.forEach(function (model) {
            var svgObject = this.viewObjects[model.id];
            if (!svgObject)svgObject = sketcherEditorCreateViewObject(this, model);
            this.viewObjects[model.id] = svgObject;
            this.viewBound.addPoint(model.begin);
            this.viewBound.addPoint(model.end);
        }, this);
    }
});


function utilBindSketcherEditorEvents(view) {
    var context = view.context;
    var svg = context.defs.ownerSVGElement;

    function onMouseEvent(evt) {
        //console.log(evt.type);
        var position = view.PS2M(evt.pageX, evt.pageY);
        System.cmdExe(evt.type + "_sketchereditor2d", evt, position);
        if (evt.type == "click") {
            pickModel(undefined, evt.ctrlKey);
        }
    }

    svg.addEventListener('mousedown', onMouseEvent);
    svg.addEventListener('mousemove', onMouseEvent);
    svg.addEventListener('mouseup', onMouseEvent);
    svg.addEventListener('click', onMouseEvent);
}

function initSketcherEditor() {
    var dom = document.getElementById("sketcherEditDialogSvg");
    var canvas = SketcherEditor_svg = new SketcherEditorCanvas(dom, {name: "SketcherEditor"});
    sceneChangedEvt.add(sceneChangeEvtHandler);
}


var SketcherEditor_svg = undefined;// important......
function sketcherEditorCreateViewObject(view, model) {
    if (!(model instanceof Curve)) {
        console.error("Unknown model type!");
        return;
    }
    console.assert(view.viewObjects[model.id] == undefined);

    var svgObjectType = SketcherEditorCurve;
    var svgObject = new svgObjectType(view, model);
    svgObject.create(), svgObject.update();
    return svgObject;
}
setInterval(function () {
    if (!SketcherEditor_svg)return;
    Object.keys(SketcherEditor_svg.viewObjects).forEach(function (key) {
        var obj = SketcherEditor_svg.viewObjects[key];
        if (obj && obj.dF != 0) obj.update(), obj.dF = 0;
    });
}, 50);

function sceneChangeEvtHandler(scene, op, model) {
    if (!SketcherEditor_svg || !model) {
        return;
    }
    var svgObject = SketcherEditor_svg.viewObjects[model.id];
    if (op == "add" && !svgObject) {
        svgObject = sketcherEditorCreateViewObject(SketcherEditor_svg, model);
        SketcherEditor_svg.viewObjects[model.id] = svgObject;
    } else if (op == "remove" && svgObject) {
        svgObject.destroy();
        delete SketcherEditor_svg.viewObjects[model.id];
    } else {
        console.warn("scene change warning: " + op);
    }
};
