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
    },
    fitByZoom:function(view){
        var factor = view.viewport.width / view.initViewport.width;
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
