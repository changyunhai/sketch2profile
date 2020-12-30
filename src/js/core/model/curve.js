function Curve(opt) {
    CS(this, opt);
    defineValue(this, "bx", NaN);
    defineValue(this, "by", NaN);
    defineValue(this, "ex", NaN);
    defineValue(this, "ey", NaN);
}

CE(Curve, Entity);

Object.defineProperties(Curve.prototype, {
    begin: {
        get: function () {
            return {x: this.bx, y: this.by};
        }, set: function (v) {
            this.bx = v.x, this.by = v.y;
        }
    }, end: {
        get: function () {
            return {x: this.ex, y: this.ey};
        }, set: function (v) {
            this.ex = v.x, this.ey = v.y;
        }
    }
});
Object.assign(Curve.prototype, {
    copyTo: function (toEntity) {
        CS(this, "copyTo", toEntity);
        toEntity.bx = this.bx;
        toEntity.by = this.by;
        toEntity.ex = this.ex;
        toEntity.ey = this.ey;
    },
    toJSON: function () {
        var saved = CS(this, "toJSON");
        saved.type = "Curve";
        saved.bx = this.bx;
        saved.by = this.by;
        saved.ex = this.ex;
        saved.ey = this.ey;
        return saved;
    },
    fromJSON: function (t, e) {
        CS(this, "fromJSON", t, e);
        this.bx = t.bx;
        this.by = t.by;
        this.ex = t.ex;
        this.ey = t.ey;
    },
    getPolygon: function () {
        return [];
    },
    isValid: function () {
        return isFinite(this.bx) && isFinite(this.by) && isFinite(this.ex) && isFinite(this.ey);
    },
    getLength: function () {
        return NaN;
    }
});

Object.assign(Curve.prototype, {
    getDistanceAnchors: function (p) {
        return [this.begin, this.end];
    },
    closestPoint: function (p) {
        var anchors = this.getDistanceAnchors();
        var distance = Infinity, rv = undefined;
        for (var i = 0; i < anchors.length; ++i) {
            var pt = anchors[i], len = Math2d.LineLength(pt, p);
            if (len < distance) distance = len, rv = pt;
        }
        return rv;
    },
    farthestPoint: function (p) {
        var anchors = this.getDistanceAnchors(p);
        var distance = -Infinity, rv = undefined;
        for (var i = 0; i < anchors.length; ++i) {
            var pt = anchors[i], len = Math2d.LineLength(pt, p);
            if (len > distance) distance = len, rv = pt;
        }
        return rv;
    }
});



 

//# sourceURL=file://js/core/model/curve.js