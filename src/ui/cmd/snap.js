function CmdSnap() {
    CS(this);
    this.snappedPoints = [{x: 0, y: 0}];
    this.snappedCurves = [];
}
CE(CmdSnap, CmdBase);
Object.assign(CmdSnap.prototype, {
    begin: function () {
        CS(this, "begin");
        var curves = sceneAllModels().filter(function (entity) {
            return entity instanceof Curve;
        });
        var loops = sceneAllModels().filter(function (entity) {
            return entity instanceof Loop;
        });
        this.snappedCurves = curves;
        curves.forEach(function (curve) {
            this.snappedPoints.push(curve.begin, curve.end, curve.middle, curve.center);
        }, this);
        loops.forEach(function (loop) {
            loop.curves.forEach(function (curve) {
                this.snappedPoints.push(curve.begin, curve.end, curve.middle, curve.center);
            }, this);
        }, this);
        this.snappedPoints = this.snappedPoints.filter(function (pt) {
            return pt;
        });
    },
    snapPoint: function (pt) {
        var snapPt = this.snappedPoints.find(function (spt) {
            return Math2d.IsSamePoint(pt, spt, 0.15);
        });
        if (!snapPt) {
            // todo snap to curve:
        }
        return snapPt || pt;
    }
});