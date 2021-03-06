function Loop(opt) {
    CS(this, opt);
    defineValue(this, "curves", []);
    defineValue(this, "vertices", []);
    defineValue(this, "containLoops", []);
}

Loop.prototype.type = "Loop";
CE(Loop, Entity);
Object.assign(Loop.prototype, {
    toJSON: function () {
        var saved = CS(this, "toJSON");
        saved.type = "Loop";//todo curves
        saved.curves = this.curves.map(function (item) {
            return {
                id:item.id,
                oId:item.oId
            };
        });
        saved.id = this.id;
        saved.oId = this.oId;
        saved.vertices = this.vertices.filter(function (pt) {
            return pt;
        }).map(function (pt) {
            return {x: pt.x, y: pt.y};
        });
        return saved;
    }, fromJSON: function (t, e) {
        CS(this, "fromJSON", t, e);
        var allModels = e || sceneAllModels();
        this.curves = t.curves/*.map(function (item) {
            return allModels.find(function (model) {
                return model.id == item;
            });
        })*/;
        if (t.vertices) this.vertices = t.vertices;
        this.id = t.id;
        this.oId = t.oId;
    }, isValid: function () {
        return this.curves.length > 1;
    }, getPolygon: function (simplified) {
        return buildLoopPoints(this.curves, this.vertices[0]);
    }
});

function buildLoopPoints(curves, startV) {
    var poly = [];
    for (var i = 0, len = curves.length; i < len; ++i) {
        var thisCurve = curves[i];
        if (!(thisCurve instanceof Curve)) continue;

        if (!thisCurve.isValid()) {
            console.warn("Curve is not Valid, please check.");
        }
        var curvePoly = thisCurve.getPolygon();
        if (Math2d.IsSamePoint(thisCurve.begin, startV)) {
            startV = thisCurve.end;
        } else if (Math2d.IsSamePoint(thisCurve.end, startV)) {
            startV = thisCurve.begin;
            curvePoly = curvePoly.reverse();
        } else {
            console.error("Error: not closed polygon.")
        }
        Array.prototype.push.apply(poly, curvePoly);
    }
    //poly = Math2d.PointsMakeNormalize(poly);
    return poly.reverse();
}

 

//# sourceURL=file://js/core/model/loop.js