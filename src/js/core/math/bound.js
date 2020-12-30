/**
 * Class for representing rectangular regions.
 * @param {number} x Left.
 * @param {number} y Top.
 * @param {number} w Width.
 * @param {number} h Height.
 * @constructor
 */
function Bound(x, y, w, h) {
    /**
     * Left
     * @type {number}
     */
    this.left = x;

    /**
     * Top
     * @type {number}
     */
    this.top = y;

    /**
     * Width
     * @type {number}
     */
    this.width = w;

    /**
     * Height
     * @type {number}
     */
    this.height = h;
};


/**
 * Returns a new copy of the rectangle.
 * @return {!Bound} A clone of this Rectangle.
 */
Bound.prototype.clone = function () {
    return new Bound(this.left, this.top, this.width, this.height);
};


/**
 * Returns a nice string representing size and dimensions of rectangle.
 * @return {string} In the form (50, 73 - 75w x 25h).
 * @override
 */
Bound.prototype.toString = function () {
    return '(' + this.left + ', ' + this.top + ' - ' + this.width + 'w x ' +
        this.height + 'h)';
};


/**
 * Compares rectangles for equality.
 * @param {Bound} a A Rectangle.
 * @param {Bound} b A Rectangle.
 * @return {boolean} True iff the rectangles have the same left, top, width,
 *     and height, or if both are null.
 */
Bound.equals = function (a, b) {
    if (a == b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    return a.left == b.left && a.width == b.width &&
        a.top == b.top && a.height == b.height;
};


/**
 * Computes the intersection of this rectangle and the rectangle parameter.  If
 * there is no intersection, returns false and leaves this rectangle as is.
 * @param {Bound} rect A Rectangle.
 * @return {boolean} True iff this rectangle intersects with the parameter.
 */
Bound.prototype.intersection = function (rect) {
    var x0 = Math.max(this.left, rect.left);
    var x1 = Math.min(this.left + this.width, rect.left + rect.width);

    if (x0 <= x1) {
        var y0 = Math.max(this.top, rect.top);
        var y1 = Math.min(this.top + this.height, rect.top + rect.height);

        if (y0 <= y1) {
            this.left = x0;
            this.top = y0;
            this.width = x1 - x0;
            this.height = y1 - y0;

            return true;
        }
    }
    return false;
};


/**
 * Returns the intersection of two rectangles. Two rectangles intersect if they
 * touch at all, for example, two zero width and height rectangles would
 * intersect if they had the same top and left.
 * @param {Bound} a A Rectangle.
 * @param {Bound} b A Rectangle.
 * @return {Bound} A new intersection rect (even if width and height
 *     are 0), or null if there is no intersection.
 */
Bound.intersection = function (a, b) {
    // There is no nice way to do intersection via a clone, because any such
    // clone might be unnecessary if this function returns null.  So, we duplicate
    // code from above.

    var x0 = Math.max(a.left, b.left);
    var x1 = Math.min(a.left + a.width, b.left + b.width);

    if (x0 <= x1) {
        var y0 = Math.max(a.top, b.top);
        var y1 = Math.min(a.top + a.height, b.top + b.height);

        if (y0 <= y1) {
            return new Bound(x0, y0, x1 - x0, y1 - y0);
        }
    }
    return null;
};


/**
 * Returns whether two rectangles intersect. Two rectangles intersect if they
 * touch at all, for example, two zero width and height rectangles would
 * intersect if they had the same top and left.
 * @param {Bound} a A Rectangle.
 * @param {Bound} b A Rectangle.
 * @return {boolean} Whether a and b intersect.
 */
Bound.intersects = function (a, b) {
    return (a.left <= b.left + b.width && b.left <= a.left + a.width &&
    a.top <= b.top + b.height && b.top <= a.top + a.height);
};


/**
 * Returns whether a rectangle intersects this rectangle.
 * @param {Bound} rect A rectangle.
 * @return {boolean} Whether rect intersects this rectangle.
 */
Bound.prototype.intersects = function (rect) {
    return Bound.intersects(this, rect);
};


/**
 * Computes the difference regions between two rectangles. The return value is
 * an array of 0 to 4 rectangles defining the remaining regions of the first
 * rectangle after the second has been subtracted.
 * @param {Bound} a A Rectangle.
 * @param {Bound} b A Rectangle.
 * @return {!Array.<!Bound>} An array with 0 to 4 rectangles which
 *     together define the difference area of rectangle a minus rectangle b.
 */
var utilBoundDifference = function (a, b) {
    var intersection = Bound.intersection(a, b);
    if (!intersection || !intersection.height || !intersection.width) {
        return [a.clone()];
    }

    var result = [];

    var top = a.top;
    var height = a.height;

    var ar = a.left + a.width;
    var ab = a.top + a.height;

    var br = b.left + b.width;
    var bb = b.top + b.height;

    // Subtract off any area on top where A extends past B
    if (b.top > a.top) {
        result.push(new Bound(a.left, a.top, a.width, b.top - a.top));
        top = b.top;
        // If we're moving the top down, we also need to subtract the height diff.
        height -= b.top - a.top;
    }
    // Subtract off any area on bottom where A extends past B
    if (bb < ab) {
        result.push(new Bound(a.left, bb, a.width, ab - bb));
        height = bb - top;
    }
    // Subtract any area on left where A extends past B
    if (b.left > a.left) {
        result.push(new Bound(a.left, top, b.left - a.left, height));
    }
    // Subtract any area on right where A extends past B
    if (br < ar) {
        result.push(new Bound(br, top, ar - br, height));
    }

    return result;
};


/**
 * Computes the difference regions between this rectangle and {@code rect}. The
 * return value is an array of 0 to 4 rectangles defining the remaining regions
 * of this rectangle after the other has been subtracted.
 * @param {Bound} rect A Rectangle.
 * @return {!Array.<!Bound>} An array with 0 to 4 rectangles which
 *     together define the difference area of rectangle a minus rectangle b.
 */
Bound.prototype.difference = function (rect) {
    return Bound.difference(this, rect);
};


/**
 * Expand this rectangle to also include the area of the given rectangle.
 * @param {Bound} rect The other rectangle.
 */
Bound.prototype.boundingRect = function (rect) {
    // We compute right and bottom before we change left and top below.
    var right = Math.max(this.left + this.width, rect.left + rect.width);
    var bottom = Math.max(this.top + this.height, rect.top + rect.height);

    this.left = Math.min(this.left, rect.left);
    this.top = Math.min(this.top, rect.top);

    this.width = right - this.left;
    this.height = bottom - this.top;
};


/**
 * Returns a new rectangle which completely contains both input rectangles.
 * @param {Bound} a A rectangle.
 * @param {Bound} b A rectangle.
 * @return {Bound} A new bounding rect, or null if either rect is
 *     null.
 */
var utilBoundBoundingRect = function (a, b) {
    if (!a || !b) {
        return null;
    }

    var clone = a.clone();
    clone.boundingRect(b);

    return clone;
};


/**
 * Tests whether this rectangle entirely contains another rectangle or
 * coordinate.
 *
 * @param {Bound|goog.math.Coordinate} another The rectangle or
 *     coordinate to test for containment.
 * @return {boolean} Whether this rectangle contains given rectangle or
 *     coordinate.
 */
Bound.prototype.contains = function (another) {
    if (another instanceof Bound) {
        return this.left <= another.left &&
            this.left + this.width >= another.left + another.width &&
            this.top <= another.top &&
            this.top + this.height >= another.top + another.height;
    } else { // (another instanceof goog.math.Coordinate)
        return another.x >= this.left &&
            another.x <= this.left + this.width &&
            another.y >= this.top &&
            another.y <= this.top + this.height;
    }
};


/**
 * Rounds the fields to the next larger integer values.
 * @return {!Bound} This rectangle with ceil'd fields.
 */
Bound.prototype.ceil = function () {
    this.left = Math.ceil(this.left);
    this.top = Math.ceil(this.top);
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this;
};


/**
 * Rounds the fields to the next smaller integer values.
 * @return {!Bound} This rectangle with floored fields.
 */
Bound.prototype.floor = function () {
    this.left = Math.floor(this.left);
    this.top = Math.floor(this.top);
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this;
};


/**
 * Rounds the fields to nearest integer values.
 * @return {!Bound} This rectangle with rounded fields.
 */
Bound.prototype.round = function () {
    this.left = Math.round(this.left);
    this.top = Math.round(this.top);
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this;
};


/**
 * Translates this rectangle by the given offsets. If a
 * {@code goog.math.Coordinate} is given, then the left and top values are
 * translated by the coordinate's x and y values. Otherwise, top and left are
 * translated by {@code tx} and {@code opt_ty} respectively.
 * @param {number|goog.math.Coordinate} tx The value to translate left by or the
 *     the coordinate to translate this rect by.
 * @param {number=} opt_ty The value to translate top by.
 * @return {!Bound} This rectangle after translating.
 */
Bound.prototype.translate = function (tx, opt_ty) {
    if (tx.x) {
        this.left += tx.x;
        this.top += tx.y;
    } else {
        this.left += tx;
        if ((opt_ty)) {
            this.top += opt_ty;
        }
    }
    return this;
};


/**
 * Scales this rectangle by the given scale factors. The left and width values
 * are scaled by {@code sx} and the top and height values are scaled by
 * {@code opt_sy}.  If {@code opt_sy} is not given, then all fields are scaled
 * by {@code sx}.
 * @param {number} sx The scale factor to use for the x dimension.
 * @param {number=} opt_sy The scale factor to use for the y dimension.
 * @return {!Bound} This rectangle after scaling.
 */
Bound.prototype.scale = function (sx, opt_sy) {
    var sy = (opt_sy) ? opt_sy : sx;
    this.left *= sx;
    this.width *= sx;
    this.top *= sy;
    this.height *= sy;
    return this;
};

Bound.prototype.center = function () {
    return {x: this.left + this.width / 2, y: this.top + this.height / 2};
};

Bound.prototype.radius = function () {
    return Math.sqrt(this.width * this.width + this.height * this.height) / 2;
};

///////////////////////////////////////////////////
// other Bound functions:

function utilBoundIsValid(bound) {
    return isFinite(bound.top) && isFinite(bound.left) && bound.width >= 0 && bound.height >= 0;
}
function utilBoundReset(bound) {
    bound.top = bound.left = Infinity;
    bound.width = bound.height = 0;
}
function utilBoundAddMarginClone(bound, ex, ey) {
    var cloned = new Bound();
    cloned.left = bound.left - ex;
    cloned.top = bound.top - ey;
    cloned.width = bound.width + 2 * ex;
    cloned.height = bound.height + 2 * ey;
    return cloned;
}
function utilBoundAddPoint(bound, point) {
    if (!isFinite(bound.left) || isNaN(bound.left)) {
        bound.left = point.x;
        bound.top = point.y;
        return;
    }
    if (point.x < bound.left) {
        bound.width += bound.left - point.x;
        bound.left = point.x;
    } else bound.width = Math.max(bound.width, point.x - bound.left);

    if (point.y < bound.top) {
        bound.height += bound.top - point.y;
        bound.top = point.y;
    } else bound.height = Math.max(bound.height, point.y - bound.top);

    return bound;// for chain
}
function utilBoundFromPolygon(poly) {
    var bound = new Bound();
    utilBoundReset(bound);
    poly && poly.forEach(function (p) {
        if (!isNaN(p.x) && !isNaN(p.y)) {
            utilBoundAddPoint(bound, p);
        }
    });
    return bound;
}
function utilBoundToPolygon(bound) {
    if (!utilBoundIsValid(bound))return undefined;

    return [{x: bound.left, y: bound.top},
        {x: bound.left + bound.width, y: bound.top},
        {x: bound.left + bound.width, y: bound.top + bound.height},
        {x: bound.left, y: bound.top + bound.height},
        {x: bound.left, y: bound.top}
    ];
}
function utilBoundAddBound(thisBound, anotherBound) {
    utilBoundAddPoint(thisBound, {x: anotherBound.left, y: anotherBound.top});
    utilBoundAddPoint(thisBound, {x: anotherBound.left + anotherBound.width, y: anotherBound.top});
    utilBoundAddPoint(thisBound, {x: anotherBound.left, y: anotherBound.top + anotherBound.height});
    utilBoundAddPoint(thisBound, {
        x: anotherBound.left + anotherBound.width,
        y: anotherBound.top + anotherBound.height
    });
    return thisBound;//for chain
}

///////////////////////////////////////////
// for export api:
Bound.prototype.isValid = function () {
    return utilBoundIsValid(this);
}
Bound.prototype.reset = function () {
    utilBoundReset(this);
}
Bound.prototype.addMarginClone = function (ex, ey) {
    return utilBoundAddMarginClone(this, ex, ey);
}
Bound.prototype.addPoint = function (pt) {
    return utilBoundAddPoint(this, pt);
}
Bound.prototype.toPolygon = function () {
    return utilBoundToPolygon(this);
}
Bound.prototype.addBound = function (anotherBound) {
    return utilBoundAddBound(this, anotherBound);
}

//--------------------  static -----
Bound.fromPolygon = function (poly) {
    return utilBoundFromPolygon(poly);
}
Bound.fromCenterWidthHeight = function (center, width, height) {
    return Bound.fromCenterAndOnePoint(center, {x: center.x + width / 2, y: center.y + height / 2});
}
Bound.fromCenterAndOnePoint = function (center, onePoint) {
    var bound = new Bound();
    bound.reset();
    bound.addPoint(onePoint);
    bound.addPoint({x: 2 * center.x - onePoint.x, y: 2 * center.y - onePoint.y});
    return bound;
}

 

//# sourceURL=file://js/core/math/bound.js