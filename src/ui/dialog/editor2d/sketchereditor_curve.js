function SketcherEditorCurve(view, model) {
    CS(this, view, model);
}
SketcherEditorCurve.PICKED_DISPLAY_STROKE_WIDTH = 5;
SketcherEditorCurve.UNPICKED_DISPLAY_STROKE_WIDTH = 3;
SketcherEditorCurve.PATH_MASK_STROKE_WIDTH = 12;

CE(SketcherEditorCurve, ViewObjectBase);
Object.assign(SketcherEditorCurve.prototype, {
    create: function () {
        var context = this.view.context, tol = 0.05;
        if (!context)return;
        if (this.svgs && this.svgs.length > 0)return;

        var view = this.view;
        var model = this.model;
        console.assert(view);

        var path = this.path = context.path().attr({
            fill: "none", display: "none",
            "stroke-width": SketcherEditorCurve.UNPICKED_DISPLAY_STROKE_WIDTH,
            "stroke": "blue"
        });
        var pathMask = this.pathMask = context.path().attr({
            fill: "none", display: "none",
            "stroke-width": SketcherEditorCurve.PATH_MASK_STROKE_WIDTH,
            "stroke-opacity": 0,
            "stroke": "gray"
        });
        var begin = this.begin = context.circle(NaN, NaN, 7).attr({
            "fill": "blue", display: "none",
            "fill-opacity": 0.5,
            cursor: "move"
        });
        var end = this.end = context.circle(NaN, NaN, 7).attr({
            "fill": "blue", display: "none",
            "fill-opacity": 0.5,
            cursor: "move"
        });
        var middle = this.middle = context.circle(NaN, NaN, 7).attr({
            "fill": "red", display: "none",
            "fill-opacity": 0.5,
            cursor: "move"
        });
        var center = this.center = context.circle(NaN, NaN, 5).attr({
            "fill": "gray", display: "none",
            "fill-opacity": 0.5
        });
        var centerBegin = this.centerBegin = context.line().attr({
            fill: "none", display: "none",
            "stroke-width": 1,
            "stroke": "gray",
            'stroke-dasharray': "4,6"
        });
        var centerEnd = this.centerEnd = context.line().attr({
            fill: "none", display: "none",
            "stroke-width": 1,
            "stroke": "gray",
            'stroke-dasharray': "4,6"
        });

        this.svgs.push(centerBegin, centerEnd, path, pathMask, center, middle, begin, end);

        // events:
        function dragPointDown(prop, x, y, e) {
            if (!(e instanceof Event))return;
            e.stopPropagation();
            if (e.button == 1)return;
            var modelPos = view.PS2M(view, x, y);
            var model = this.model;
        }

        function dragPointMove(prop, dx, dy, x, y, e) {
            if (!(e instanceof Event))return;
            e.stopPropagation();
            if (e.button == 1)return;
            var modelPos = view.PS2M(view, x, y);
            System.cmdExe(e.type, e, modelPos);
        }

        function dragPointUp(prop, e) {
            if (!(e instanceof Event))return;
            e.stopPropagation();
            if (e.button == 1)return;
            delete this.commons;
            System.cmdEnd();
        }

        function curveClick(e) {
            if (!(e instanceof Event))return;
            e.stopPropagation();
            console.log("Click Curve :" + this.model.type);
            var did = this.path.attr("did");
            if (this.path.mousein === true)pickModel(this.model, e && e.ctrlKey);
        }

        this.pathMask.click(curveClick.bind(this)).mouseover(function (e) {
            this.path.attr({"stroke-width": SketcherEditorCurve.PICKED_DISPLAY_STROKE_WIDTH});
            this.path.mousein = true;
        }.bind(this)).mouseout(function (e) {
            this.path.attr({"stroke-width": SketcherEditorCurve.UNPICKED_DISPLAY_STROKE_WIDTH});
            this.path.mousein = false;
        }.bind(this));
        this.middle.drag(dragPointMove.bind(this, "middle"), dragPointDown.bind(this, "middle"), dragPointUp.bind(this, "middle"), this, this, this);
        this.begin.drag(dragPointMove.bind(this, "begin"), dragPointDown.bind(this, "begin"), dragPointUp.bind(this, "begin"), this, this, this);
        this.end.drag(dragPointMove.bind(this, "end"), dragPointDown.bind(this, "end"), dragPointUp.bind(this, "end"), this, this, this);

        // model events:
        model.vce.add(function (sender, field, oldV, newV) {
            this.dF |= 1;
        }.bind(this));
        this.dF |= 1;

        // add to Layer:

    },
    update: function () {
        var f = 100, curve = this.model, area = this.area;

        for (var i = 0; i < this.svgs.length; ++i) {
            this.svgs[i].attr({display: "none"});
        }
        if (!curve || !curve.isValid())return;
        var center = curve.center, middle = curve.middle;
        var highlight = System.modelIsFlagOn(curve, MODELFLAG_PICKED);

        var pathStr = utilSnapBuildAreaPolySvgPath(curve);
        this.pathMask.attr({display: "block", path: pathStr});
        this.path.attr({
            display: "block",
            path: pathStr,
            did: curve.id,
            stroke: (highlight ? "darkblue" : "blue"),
            "stroke-width": (highlight ? SketcherEditorCurve.PICKED_DISPLAY_STROKE_WIDTH : SketcherEditorCurve.UNPICKED_DISPLAY_STROKE_WIDTH)
        });
        this.begin.attr({display: (highlight ? "block" : "none"), cx: curve.begin.x * f, cy: curve.begin.y * -f});
        this.end.attr({display: (highlight ? "block" : "none"), cx: curve.end.x * f, cy: curve.end.y * -f});
        this.middle.attr({display: (highlight ? "block" : "none"), cx: middle.x * f, cy: middle.y * -f});

        if (curve instanceof CurveArc) {
            this.center.attr({display: (highlight ? "block" : "none"), cx: center.x * f, cy: center.y * -f});
            this.centerBegin.attr({
                display: (highlight ? "block" : "none"),
                x1: curve.begin.x * f, y1: curve.begin.y * -f,
                x2: center.x * f, y2: center.y * -f
            });
            this.centerEnd.attr({
                display: (highlight ? "block" : "none"),
                x1: curve.end.x * f, y1: curve.end.y * -f,
                x2: center.x * f, y2: center.y * -f
            })
        }
    },
    destroy: function () {
        this.svgs.forEach(function (ele) {
            ele.remove();
        });
    }
});


function utilSnapBuildAreaPolySvgPath(model) {
    if (!model || !model.isValid())return "";
    var factor = 100;
    var curvePts = model.getPolygon();
    var svgPath = "M" + curvePts.map(function (pt) {
            return pt && (pt.x * factor + "," + pt.y * -factor);
        }).join("L");
    return svgPath;
}