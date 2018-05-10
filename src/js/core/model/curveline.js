function CurveLine(opt) {
    CS(this, opt);
}
CurveLine.prototype.type = "CurveLine";
CE(CurveLine, Curve);

Object.defineProperties(CurveLine.prototype, {
    middle: {
        get: function () {
            return {x: (this.begin.x + this.end.x) / 2, y: (this.begin.y + this.end.y) / 2};
        }, set: function (v) {
        }
    },
    beginTangent: {
        get: function () {
            return {x: this.end.x - this.begin.x, y: this.end.y - this.begin.y};
        }
    },
    endTangent: {
        get: function () {
            return {x: this.begin.x - this.end.x, y: this.begin.y - this.end.y};
        }
    },
    beginTangentOffset: {
        get: function () {
            return this.beginTangent;
        }
    },
    endTangentOffset: {
        get: function () {
            return this.endTangent;
        }
    }
});


Object.assign(CurveLine.prototype, {
    isValid: function () {
        var valid = CS(this, "isValid");
        return valid && (this.getLength && this.getLength() > 0.05);
    },
    toJSON: function () {
        var saved = CS(this, "toJSON");
        saved.type = "CurveLine";
        return saved;
    },
    getPolygon: function () {
        return [{x: this.begin.x, y: this.begin.y, pid: this.begin.id},
            {x: this.end.x, y: this.end.y, pid: this.end.id}];
    },

    getLength: function () {
        return Math2d.LineLength(this.begin, this.end);
    },

    intersect: function (anotherCurve) {
        if (anotherCurve instanceof CurveLine)return utilCurveLineLineIntersect(this, anotherCurve);
        else if (anotherCurve instanceof CurveArc)return utilCurveArcLineIntersect(anotherCurve, this);
        else throw new Error("What curve ?");
    },
    ptIn: function (pt) {
        if (!pt)return false;
        if (Math2d.IsSamePoint(pt, this.begin) || Math2d.IsSamePoint(pt, this.end))return true;
        var isPtIn = Math2d.IsPointInLineSegment(pt, this.begin, this.end, 0.01);
        return isPtIn;
    },
    getLerpNumber: function (pt) {
        console.assert(this.ptIn(pt), "pt is not in this curve");
        return Math2d.GetLerpNumber(this.begin, this.end, pt);
    },
    equals: function (anotherCurve) {
        if (!( anotherCurve instanceof CurveLine))return false;
        if ((Math2d.IsSamePoint(this.begin, anotherCurve.begin) && Math2d.IsSamePoint(this.end, anotherCurve.end)) ||
            (Math2d.IsSamePoint(this.end, anotherCurve.begin) && Math2d.IsSamePoint(this.begin, anotherCurve.end)))return true;
        return false;
    }
});




