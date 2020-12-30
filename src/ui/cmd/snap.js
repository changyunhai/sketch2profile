function CmdSnap() {
    CS(this);
    this.snappedPoints = [{x: 0, y: 0}];
}

CE(CmdSnap, CmdBase);
Object.assign(CmdSnap.prototype, {
    begin: function () {
        CS(this, "begin");
        view2d.mousePoint.attr({"display": "block", x: NaN, y: NaN});

        var curves = sceneAllModels().filter(function (entity) {
            return entity instanceof Curve;
        });
        var loops = sceneAllModels().filter(function (entity) {
            return entity instanceof Loop;
        });
        curves.forEach(function (curve) {
            this.snappedPoints.push(curve.begin, curve.end);
        }, this);
        loops.forEach(function (loop) {
            if (loop.vertices) this.snappedPoints = this.snappedPoints.concat(loop.vertices);
        }, this);
        this.snappedPoints = this.snappedPoints.filter(function (pt) {
            return pt && isFinite(pt.x) && isFinite(pt.y);
        });
    },
    end: function () {
        CS(this, "end");
        view2d.mousePoint.attr({"display": "none"});
    },
    snapPoint: function (pt) {
        var snapPt = this.snappedPoints.find(function (spt) {
            var factor = SketcherEditor_svg.viewport.width / SketcherEditor_svg.initViewport.width;
            var tol = 0.15 * Math.min(factor, 1);
            return Math2d.IsSamePoint(pt, spt, tol);
        });
        if (!snapPt) {
            // todo snap to curve:
        }
        return snapPt || pt;
    }
});

//# sourceURL=file://ui/cmd/snap.js