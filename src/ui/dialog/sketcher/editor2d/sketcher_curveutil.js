
function utilSketcherCurveLineMoveMiddleRestriction(begin, end, newMiddle) {
    var beginEnd_Mid = {x: (begin.x + end.x) / 2, y: (begin.y + end.y) / 2};
    var dir = {x: newMiddle.x - beginEnd_Mid.x, y: newMiddle.y - beginEnd_Mid.y};
    var normal = (new Vec2(end.y - begin.y, begin.x - end.x)).normalize();
    var offsetDistance = Vec2.dot(normal, dir), sign = Math.sign(offsetDistance);
    var offsetDirPoint = {x: beginEnd_Mid.x + normal.x * sign, y: beginEnd_Mid.y + normal.y * sign};
    if (Math2d.IsSamePoint(beginEnd_Mid, offsetDirPoint))return {x: 0, y: 0};
    var offset = Math2d.GetScaledPoint(beginEnd_Mid, offsetDirPoint, Math.abs(offsetDistance));
    return {x: offset.x - beginEnd_Mid.x, y: offset.y - beginEnd_Mid.y};
}


function utilSketcherFindSamePoints(curve, pt, tol) {
    var curves = ___globalScene.filter(function (e) {
        return e instanceof Curve;
    });
    if (curves.length == 0 || !pt)return [];
    console.assert(isFinite(pt.x) && isFinite(pt.y));
    var rv = [];
    curves.forEach(function (curve) {
        if (!curve.isValid())return;
        if (Math2d.IsSamePoint(curve.begin, pt, tol))rv.push({curve: curve, field: "begin"});
        if (Math2d.IsSamePoint(curve.end, pt, tol))rv.push({curve: curve, field: "end"});
        if (Math2d.IsSamePoint(curve.middle, pt, tol))rv.push({curve: curve, field: "middle"});
    });
    return rv;
}
