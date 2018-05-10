function utilMathWhichSidePointOnLine(your, lineStart, lineEnd) {
    var p0 = lineStart, p1 = lineEnd, p = your;
    var delta = (p1.y - p0.y) * p.x - (p1.x - p0.x) * p.y + (p1.x * p0.y - p1.y * p0.x);
    return Math2d.Equals(delta, 0) ? "middle" : (delta > 0 ? "right" : "left");
}

function utilMathRotatePointCW(base, your, angle) {
    return Vec2.rotateAroundPoint(Vec2.fromCoordinate(your), base, utilMathToRadius(angle));
}

function utilMathEquals(a, b, tolerance) {
    return Math.abs(a - b) <= (tolerance || 0.001); // 1mm
}
function utilMathIsSamePoint(a, b, tolerance) {
    if (!a || !b)return false;
    return utilMathEquals(a.x, b.x, tolerance) && utilMathEquals(a.y, b.y, tolerance);
}


function utilMathIsLineParallel(p1, p2, p3, p4, tolerance) {
    return utilMathEquals((p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x), 0, tolerance);
}

function utilMathLineLineIntersection(p1, p2, p3, p4) {
    //here it is from: http://en.wikipedia.org/wiki/Line-line_intersection
    var det = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x), invDet = 1.0 / det;
    var _tmp1 = (p1.x * p2.y - p1.y * p2.x), _tmp2 = (p3.x * p4.y - p3.y * p4.x);
    var _x = _tmp1 * (p3.x - p4.x) - (p1.x - p2.x) * _tmp2;
    var _y = _tmp1 * (p3.y - p4.y) - (p1.y - p2.y) * _tmp2;
    return {x: _x * invDet, y: _y * invDet};
}

function utilMathGetLerpNumber(start, end, your) {
    // project this point to the line, then split by lerp.
    var project = utilMathGetPerpendicularIntersect(your, start, end);
    if (Math.abs(start.x - end.x) > Math.abs(start.y - end.y)) {
        return ((project.x - start.x) / (end.x - start.x));
    } else {
        return ((project.y - start.y) / (end.y - start.y));
    }
}
function utilMathGetPerpendicularIntersect(your/*Point*/, start/*Point*/, end/*Point*/) {
    var line = new Line(start.x, start.y, end.x, end.y);
    return line.getClosestPoint(your.x, your.y);
}
function utilMathGetClosestSegmentPoint(your/*Point*/, start/*Point*/, end/*Point*/) {
    var line = new Line(start.x, start.y, end.x, end.y);
    return line.getClosestSegmentPoint(your.x, your.y);
}
function utilMathToDegree(angleRadians) {
    return angleRadians * 180 / Math.PI;
}

function utilMathGetScaledPoint(base, your, expectedLength) {
    var line = new Line(base.x, base.y, your.x, your.y);
    var lineLen = line.length();
    if (utilMathEquals(lineLen, 0)) {
        console.warn("linelength equals 0, please check!!");
        return;
    }
    return line.getInterpolatedPoint(expectedLength / lineLen);
}


function utilMathGetAngleHorizontaleCCW(from, to) {
    return utilMathToDegree(Math.atan2(to.y - from.y, to.x - from.x));
}

function utilMathLineLength(start, end) {
    if (!start || !end)return NaN;
    var line = new Line(start.x, start.y, end.x, end.y);
    return line.length();
}
function utilMathLinelineCCWAngle(base, from, to) {// (0,360]
    var angle1 = utilMathGetAngleHorizontaleCCW(base, from);
    var angle2 = utilMathGetAngleHorizontaleCCW(base, to);
    var delta = angle2 - angle1;
    return delta > 0 ? delta : 360 + delta;
}
function utilMathIsPointInLineSegment(pt, lineFrom, lineTo, tolerance) {
    var line = new Line(lineFrom.x, lineFrom.y, lineTo.x, lineTo.y);
    var closestPt = line.getClosestPoint(pt.x, pt.y);
    if (!utilMathIsSamePoint(closestPt, pt, Math.abs(tolerance))) return false;

    var length = line.length(), proportion = -tolerance / length;
    var lerpFrom = Vec2.lerp(lineFrom, lineTo, proportion);
    var lerpTo = Vec2.lerp(lineTo, lineFrom, proportion);

    return Math.min(lerpFrom.x, lerpTo.x) <= closestPt.x &&
        Math.max(lerpFrom.x, lerpTo.x) >= closestPt.x &&
        Math.min(lerpFrom.y, lerpTo.y) <= closestPt.y &&
        Math.max(lerpFrom.y, lerpTo.y) >= closestPt.y;
}
var Math2d = {
    Equals: utilMathEquals,
    IsSamePoint: utilMathIsSamePoint,
    LineLength: utilMathLineLength,
    LinelineCCWAngle: utilMathLinelineCCWAngle,
    GetAngleHorizontaleCCW: utilMathGetAngleHorizontaleCCW,
    GetScaledPoint: utilMathGetScaledPoint,
    RotatePointCW: utilMathRotatePointCW,
    LineLineIntersection: utilMathLineLineIntersection,
    GetLerpNumber: utilMathGetLerpNumber,
    WhichSidePointOnLine: utilMathWhichSidePointOnLine,
    IsLineParallel: utilMathIsLineParallel,
    IsPointInLineSegment: utilMathIsPointInLineSegment
};
