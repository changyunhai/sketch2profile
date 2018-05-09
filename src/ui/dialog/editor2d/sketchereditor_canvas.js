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
    show: function () {
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
        this.createDisplay();

        // step3: fit:
        var viewBound = this.viewBound.addMarginClone(0.8, 0.8);
        viewBound.scale(100, 100);
        this.fit(viewBound);
    },
    createDisplay: function (type) {
    }

});


function utilBindSketcherEditorEvents(view) {
    var context = view.context;
    var svg = context.defs.ownerSVGElement;

    function onMouseEvent(evt) {
        var position = view.PS2M(view, evt.pageX, evt.pageY);
        System.cmdExe(evt.type + "_sketchereditor2d", evt, position);
    }

    svg.addEventListener('mousedown', onMouseEvent);
    svg.addEventListener('mousemove', onMouseEvent);
    svg.addEventListener('mouseup', onMouseEvent);
}

function initSketcherEditor() {
    var dom = document.getElementById("sketcherEditDialogSvg");
    var canvas = SketcherEditor_svg = new SketcherEditorCanvas(dom, {name: "SketcherEditor"});
}


var SketcherEditor_svg = undefined;// important......

setTimeout(function () {
    if (!SketcherEditor_svg)return;
    Object.keys(SketcherEditor_svg.viewObjects).forEach(function (key) {
        var obj = SketcherEditor_svg.viewObjects[key];
        if (obj && obj.dF != 0) obj.update(), obj.dF = 0;
    });
}, 50);

sceneChangedEvt.add(function (scene, op, model) {
    if (!SketcherEditor_svg || !model) {
        return;
    }
    var svgObjectType = SketcherEditorCurve;
    var svgObject = SketcherEditor_svg.viewObjects[model.id];
    if (op == "add" && !svgObject) {
        svgObject = new svgObjectType(SketcherEditor_svg, model);
        svgObject.create(), svgObject.update();
        SketcherEditor_svg.viewObjects[model.id] = svgObject;
    } else if (op == "remove" && svgObject) {
        svgObject.destroy();
        delete SketcherEditor_svg.viewObjects[model.id];
    } else {
        console.warn("scene change warning: " + op);
    }
});
