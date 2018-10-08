function CurveArc(opt) {
    CS(this, opt);
    defineValue(this, "mx", NaN);
    defineValue(this, "my", NaN);
}
CurveArc.prototype.type = "CurveArc";
CE(CurveArc, Curve);

var CURVEARC_TESSELATE_ARC_ANGLE = 3;


Object.defineProperties(CurveArc.prototype, {
    radius: {
        get: function () {
            return utilCurveArcGetRadiusByMiddle(this.begin, this.end, this.middle);
        }
    },
    fan: {
        get: function () {
            return utilCurveArcGetFanAngle(this.begin, this.end, this.middle);
        }
    },
    center: {
        get: function () {
            return utilCurveArcGetCenterByMiddle(this.begin, this.end, this.middle);
        },
        set: function (pt) {
            console.assert(Math2d.Equals(Math2d.LineLength(this.begin, pt), Math2d.LineLength(this.end, pt)));
            var mid = utilCurveArcGetMiddleByCenter(this.begin, this.end, pt, this.middle);
            this.mx = mid.x, this.my = mid.y;
        }
    },
    middle: {
        get: function () {
            return {x: this.mx, y: this.my};
        },
        set: function (mid) {
            var begin = this.begin, end = this.end;
            var beginEnd_Mid = {x: (begin.x + end.x) / 2, y: (begin.y + end.y) / 2};
            mid = Math2d.GetPerpendicularIntersect(mid, Math2d.RotatePointCW(beginEnd_Mid, begin, 90), beginEnd_Mid);
            this.mx = mid.x, this.my = mid.y;
        }
    },
    beginTangent: {
        get: function () {
            return utilCurveArcGetTangent(this.center, this.middle, this.begin);
        }
    },
    endTangent: {
        get: function () {
            return utilCurveArcGetTangent(this.center, this.middle, this.end);
        }
    },
    beginTangentOffset: {
        get: function () {
            return utilCurveArcGetTangentOffset(this.center, this.middle, this.begin);
        }
    },
    endTangentOffset: {
        get: function () {
            return utilCurveArcGetTangentOffset(this.center, this.middle, this.end);
        }
    }
});

Object.assign(CurveArc.prototype, {
    copyTo: function (toEntity) {
        CS(this, "copyTo", toEntity);
        toEntity.mx = this.mx;
        toEntity.my = this.my;
    },
    isValid: function () {
        var valid = CS(this, "isValid");
        return valid && isFinite(this.mx) && isFinite(this.my) && isFinite(this.radius);
    },
    toJSON: function () {
        var saved = CS(this, "toJSON");
        saved.type = "CurveArc";
        saved.mx = this.mx;
        saved.my = this.my;
        return saved;
    },

    getPolygon: function () {
        if (!this.isValid())return [];
        //if (simplified === true)return [this.begin, this.middle, this.end];
        var arcAngleDelta = CURVEARC_TESSELATE_ARC_ANGLE;
        var loop = [], center = this.center;
        var firstPt = this.begin;//Vec2.sum(curve.center, {x: curve.radius, y: 0});
        var fanAngle = Math.abs(this.fan);//this.fan;//(Math2d.WhichSidePointOnLine(this.middle, this.begin, this.end) == "right")
        var isMiddleOnRight = (Math2d.WhichSidePointOnLine(this.middle, this.begin, this.end) == "right");

        // build path:
        loop.push({x: this.begin.x, y: this.begin.y, pid: this.begin.id});//begin
        for (var i = arcAngleDelta; i < fanAngle; i += arcAngleDelta) {
            var pt = Math2d.RotatePointCW(center, firstPt, i * (isMiddleOnRight ? 1 : -1));
            loop.push(pt);
        }
        loop.push({x: this.end.x, y: this.end.y, pid: this.end.id});//end
        console.log("CurveArc , center=[" + (center && center.x) + "," + (center && center.y) + "],radius=" + this.radius
        + ",begin=[" + this.begin.x + "," + this.begin.y + "],end=[" +
        this.end.x + "," + this.end.y + "],fanAngle=" + fanAngle);
        return loop;
    },

    intersect: function (anotherCurve) {
        if (anotherCurve instanceof CurveLine)return utilCurveArcLineIntersect(this, anotherCurve);
        else if (anotherCurve instanceof CurveArc)return utilCurveArcArcIntersect(anotherCurve, this);
        else throw new Error("What curve ?");
    },
    ptIn: function (pt) {
        if (!pt)return false;
        if (Math2d.IsSamePoint(pt, this.begin) || Math2d.IsSamePoint(pt, this.end))return true;
        if (!Math2d.Equals(Math2d.LineLength(pt, this.center), this.radius))return false;
        var isMiddleOnRight = (Math2d.WhichSidePointOnLine(this.middle, this.begin, this.end) == "right");
        var isPtOnRight = (Math2d.WhichSidePointOnLine(pt, this.begin, this.end) == "right");
        return isMiddleOnRight === isPtOnRight;
    },
    getLerpNumber: function (pt) {
        console.assert(this.ptIn(pt), "pt is not in this curve");
        var fan = utilCurveArcGetFanAngle(this.begin, this.end, pt) / 2;
        return fan / this.fan;
    },
    equals: function (anotherCurve) {
        if (!(anotherCurve instanceof CurveArc))return false;
        if (this.mx != anotherCurve.mx || this.my != anotherCurve.my)return false;
        if ((Math2d.IsSamePoint(this.begin, anotherCurve.begin) && Math2d.IsSamePoint(this.end, anotherCurve.end)) ||
            (Math2d.IsSamePoint(this.end, anotherCurve.begin) && Math2d.IsSamePoint(this.begin, anotherCurve.end)))return true;
        return false;
    }
});


function utilCurveArcGetTangentOffset(center, middle, pt) {
    var angleOffset = 3, rpt = Math2d.RotatePointCW(center, pt, angleOffset);
    if (Vec2.dot(Vec2.difference(pt, rpt), Vec2.difference(pt, middle)) < 0)rpt = Math2d.RotatePointCW(center, pt, -angleOffset);
    return utilCurveArcGetTangent(center, middle, rpt);
}
function utilCurveArcGetTangent(center, middle, pt) {
    var normal = {x: pt.x - center.x, y: pt.y - center.y};
    var ptMid = {x: middle.x - pt.x, y: middle.y - pt.y};
    var tan = {x: normal.y, y: -normal.x};
    var sign = Vec2.dot(tan, ptMid);
    return sign > 0 ? tan : {x: -tan.x, y: -tan.y};
}

//it is ok, but deprecated:
function utilCurveArcGetMiddleByFanAngle(begin, end, fan, oldMiddle) {
    fan = Math2d.ToRadius(fan);
    var beginEnd_Mid = {x: (begin.x + end.x) / 2, y: (begin.y + end.y) / 2};
    var minRadius = Math2d.LineLength(beginEnd_Mid, begin);
    var h = minRadius * (1 - Math.cos(fan / 2)) / Math.sin(fan / 2);
    var m1 = Math2d.GetScaledPoint(beginEnd_Mid, Math2d.RotatePointCW(beginEnd_Mid, begin, 90), h);
    var m2 = Math2d.GetScaledPoint(beginEnd_Mid, Math2d.RotatePointCW(beginEnd_Mid, begin, -90), h);
    var m = Math2d.LineLength(m1, oldMiddle) > Math2d.LineLength(m2, oldMiddle) ? m2 : m1;
    return m;// mx=m.x,my=m.y;
}

function utilCurveArcGetMiddleByCenter(begin, end, center, oldMiddle) {
    var radius = Math2d.LineLength(begin, center);
    var beginEnd_Mid = {x: (begin.x + end.x) / 2, y: (begin.y + end.y) / 2};
    var mid = Math2d.GetScaledPoint(center, beginEnd_Mid, radius);
    return mid || oldMiddle;
}


function utilCurveArcGetFanAngle(begin, end, middle) {
    var center = utilCurveArcGetCenterByMiddle(begin, end, middle);
    if (!center || !isFinite(center.x)) return 0;
    var angleBegin = Math2d.GetAngleHorizontaleCCW(center, begin);
    var angleMiddle = Math2d.GetAngleHorizontaleCCW(center, middle);
    var angle = angleMiddle - angleBegin;
    angle = (360 + angle) % 360;
    if (angle > 180)angle = 360 - angle;
    return angle * 2;
}
function utilCurveArcGetCenterByMiddle(begin, end, middle) {
    if (!end || !begin)return undefined;
    console.assert(!Math2d.IsSamePoint(begin, end));
    var beginEnd_Mid = {x: (begin.x + end.x) / 2, y: (begin.y + end.y) / 2};
    var radius = utilCurveArcGetRadiusByMiddle(begin, end, middle);
    var center = Math2d.GetScaledPoint(middle, beginEnd_Mid, radius);
    return center;
}

function utilCurveArcGetRadiusByMiddle(begin, end, mid) {
    console.assert(!Math2d.IsSamePoint(begin, end));
    var beginEnd_Mid = {x: (begin.x + end.x) / 2, y: (begin.y + end.y) / 2};
    if (Math2d.IsSamePoint(beginEnd_Mid, mid))return Infinity;

    var minRadius = Math2d.LineLength(beginEnd_Mid, begin);
    var mid_mid_length = Math2d.LineLength(beginEnd_Mid, mid);
    var r = 0.5 * (mid_mid_length + minRadius * minRadius / mid_mid_length);
    return r;
}


//--------intersection detection:

function utilCurveArcArcIntersect(arc1, arc2) {
    var c1 = arc1.center, r1 = arc1.radius, c2 = arc2.center, r2 = arc2.radius, rv = [];
    var d = Math2d.LineLength(c1, c2);

    if (d > r1 + r2)return [];
    else if (Math2d.Equals(d, 0)) {
        if (Math2d.Equals(r1, r2)){
            if(Math2d.IsSamePoint(arc1.begin,arc2.begin)){
                return [arc1.begin];
            }else if(Math2d.IsSamePoint(arc1.end,arc2.end)){
                return [arc1.end];
            }else if(Math2d.IsSamePoint(arc1.begin,arc2.end)){
                return [arc1.begin];
            }else if(Math2d.IsSamePoint(arc1.end,arc2.begin)){
                return [arc1.end];
            }
            return [];
        }
        else return [];
    } else if (Math2d.Equals(d, Math.abs(r1 - r2))) {//tangential
        var tangency = Math2d.GetScaledPoint(r1 > r2 ? c1 : c2, r1 > r2 ? c2 : c1, r1 > r2 ? r1 : r2);
        if (arc1.ptIn(tangency) && arc2.ptIn(tangency)) rv.push(tangency);
        return rv;
    } else if (Math2d.Equals(d, r1 + r2)) {// one point:
        var tangency = Math2d.GetScaledPoint(c1, c2, r1);
        return (arc1.ptIn(tangency) && arc2.ptIn(tangency)) ? [tangency] : [];
    }
    // two points:
    var pt_center = Math2d.GetScaledPoint(c1, c2, r1 * r1 / d), m = r1 * r2 / d;
    var pt0 = Math2d.GetScaledPoint(pt_center, Math2d.RotatePointCW(pt_center, c1, 90), m);
    var pt1 = Math2d.GetScaledPoint(pt_center, Math2d.RotatePointCW(pt_center, c1, -90), m);
    if (arc1.ptIn(pt0) && arc2.ptIn(pt0))rv.push(pt0);
    if (arc1.ptIn(pt1) && arc2.ptIn(pt1))rv.push(pt1);
    return rv;
}

function utilCurveArcLineIntersect(arc, line) {
    var center = arc.center, radius = arc.radius, rv = [];
    var perpedicular = Math2d.GetPerpendicularIntersect(center, line.begin, line.end);
    var len = Math2d.LineLength(center, perpedicular);
    if (len > radius)return [];
    var d = Math.sqrt(radius * radius - len * len);

    var pt0 = Math2d.GetScaledPoint(perpedicular,
        Math2d.IsSamePoint(perpedicular, center) ? line.begin : Math2d.RotatePointCW(perpedicular, center, 90), d);
    var pt1 = Math2d.GetScaledPoint(perpedicular,
        Math2d.IsSamePoint(perpedicular, center) ? line.end : Math2d.RotatePointCW(perpedicular, center, -90), d);
    if (arc.ptIn(pt0) && line.ptIn(pt0))rv.push(pt0);
    if (arc.ptIn(pt1) && line.ptIn(pt1))rv.push(pt1);

    return rv;
}

function utilCurveLineLineIntersect(line1, line2) {
    if (Math2d.IsLineParallel(line1.begin, line1.end, line2.begin, line2.end))return [];
    var intersection = Math2d.LineLineIntersection(line1.begin, line1.end, line2.begin, line2.end);
    if (!line1.ptIn(intersection) || !line2.ptIn(intersection)) return [];// not intersect!!
    return [intersection];
}

