function Loop(opt) {
    CS(this, opt);
    defineValue(this, "curves", []);
}
Loop.prototype.type = "Loop";
CE(Loop, Entity);
Object.assign(Loop.prototype, {
    toJSON: function () {
        var saved = CS(this, "toJSON");
        saved.type = "Loop";//todo curves
        return saved;
    }, isValid: function () {
        return this.curves.length > 1;
    }, getPolygon: function (simplified) {
        var poly = [];
        for (var i = 0, len = this.curves.length; i < len; ++i) {
            var thisCurve = this.curves[i], nextCurve = this.curves[(i + 1) % len];
            if (!thisCurve.isValid()) {
                console.warn("Curve is not Valid, please check.");
            }
            var curvePoly = thisCurve.getPolygon(simplified);
            if (Math2d.IsSamePoint(thisCurve.end, nextCurve.begin) || Math2d.IsSamePoint(thisCurve.end, nextCurve.end)) {
            } else if (Math2d.IsSamePoint(thisCurve.begin, nextCurve.begin) || Math2d.IsSamePoint(thisCurve.begin, nextCurve.end)) {
                curvePoly = curvePoly.reverse();
            } else {
                console.error("Error: not closed polygon.")
            }
            Array.prototype.push.apply(poly, curvePoly);
        }
        poly = Math2d.PointsMakeNormalize(poly);
        return poly.reverse();
    }
});