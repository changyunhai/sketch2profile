function SketcherEditorCanvas(dom, opt) {
    CS(this, dom, opt);

    this.createLayersOrder();
    this.init();

    this.viewBound = new Bound();
    this.viewBound.reset();

    //-- specified:
    this.host = undefined;
    this.side = undefined;
    this.outline = [];
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
    show: function (host, side) {
        this.clear();
        this.host = host;
        this.side = side;
        this.outline = [];


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
        var host = this.host;
        if (!host)return;

        this.createSketcherPoly();
    },
    createSketcherPoly: function () {
        var host = this.host, side = this.side;

        var polys = [];// todo fetch from scene.
        var curves = [];// todo fetch from scene.

        for (var i = 0; i < polys.length; ++i) {
            var polyModel = polys[i];
            var snapPoly = this.dl[polyModel.id] = this.dl[polyModel.id] || new SnapSketcherArea(polyModel, this);
            var layer = this.layers["PROFILES"];
            snapPoly.create();
            snapPoly.bind({main: layer});
            snapPoly.update();
        }
        for (var i = 0; i < curves.length; ++i) {
            var curveModel = curves[i];
            var snapCurve = this.dl[curveModel.id] = this.dl[curveModel.id] || new SnapSketcherCurve(curveModel, this);
            var layer = this.layers["CURVES"];
            snapCurve.create();
            snapCurve.bind({main: layer});
            snapCurve.update();
        }

    }

});


function utilBindSketcherEditorEvents(view) {
    var context = view.context;
    var svg = context.defs.ownerSVGElement;

    function onMouseEvent(evt) {
        var position = view.PS2M(view, evt.pageX, evt.pageY);
    }

    svg.addEventListener('mousedown', onMouseEvent);
    svg.addEventListener('mousemove', onMouseEvent);
    svg.addEventListener('mouseup', onMouseEvent);
}

function initSketcherEditor() {
    var dom = document.getElementById("sketcherEditDialogSvg");
    var canvas = SketcherEditor_svg = new SketcherEditorCanvas(dom, {fps: 15, name: "SketcherEditor"});
}


var SketcherEditor_svg = undefined;// important......


