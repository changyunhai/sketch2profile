// copy from goog closue library line.js


/**
 * Object representing a line.
 * @param {number} x0 X coordinate of the start point.
 * @param {number} y0 Y coordinate of the start point.
 * @param {number} x1 X coordinate of the end point.
 * @param {number} y1 Y coordinate of the end point.
 * @constructor
 */
function Line(x0, y0, x1, y1) {
    /**
     * X coordinate of the first point.
     * @type {number}
     */
    this.x0 = x0;

    /**
     * Y coordinate of the first point.
     * @type {number}
     */
    this.y0 = y0;

    /**
     * X coordinate of the first control point.
     * @type {number}
     */
    this.x1 = x1;

    /**
     * Y coordinate of the first control point.
     * @type {number}
     */
    this.y1 = y1;
}


/**
 * @return {!Line} A copy of this line.
 */
Line.prototype.clone = function () {
    return new Line(this.x0, this.y0, this.x1, this.y1);
};


/**
 * Tests whether the given line is exactly the same as this one.
 * @param {Line} other The other line.
 * @return {boolean} Whether the given line is the same as this one.
 */
Line.prototype.equals = function (other) {
    var tol = 0.002;
    return Math.abs(this.x0 - other.x0) < tol
        && Math.abs(this.y0 - other.y0) < tol
        && Math.abs(this.x1 - other.x1) < tol
        && Math.abs(this.y1 - other.y1) < tol;
};


/**
 * @return {number} The squared length of the line segment used to define the
 *     line.
 */
Line.prototype.lengthSquared = function () {
    var xdist = this.x1 - this.x0;
    var ydist = this.y1 - this.y0;
    return xdist * xdist + ydist * ydist;
};


/**
 * @return {number} The length of the line segment used to define the line.
 */
Line.prototype.length = function () {
    return Math.sqrt(this.lengthSquared());
};


/**
 * Computes the interpolation parameter for the point on the line closest to
 * a given point.
 * @param {number|goog.math.Coordinate} x The x coordinate of the point, or
 *     a coordinate object.
 * @param {number=} opt_y The y coordinate of the point - required if x is a
 *     number, ignored if x is a goog.math.Coordinate.
 * @return {number} The interpolation parameter of the point on the line
 *     closest to the given point.
 * @private
 */
Line.prototype.closestInte_ = function (x, opt_y) {
    var y = opt_y;

    var x0 = this.x0;
    var y0 = this.y0;

    var xChange = this.x1 - x0;
    var yChange = this.y1 - y0;

    return ((x - x0) * xChange + (y - y0) * yChange) /
        this.lengthSquared();
};


/**
 * Returns the point on the line segment proportional to t, where for t = 0 we
 * return the starting point and for t = 1 we return the end point.  For t < 0
 * or t > 1 we extrapolate along the line defined by the line segment.
 * @param {number} t The interpolation parameter along the line segment.
 * @return {!goog.math.Coordinate} The point on the line segment at t.
 */
Line.prototype.getInterpolatedPoint = function (t) {
    function lerp(a, b, x) {
        return a + x * (b - a);
    }

    return {
        x: lerp(this.x0, this.x1, t),
        y: lerp(this.y0, this.y1, t)
    };
};


/**
 * Computes the point on the line closest to a given point.  Note that a line
 * in this case is defined as the infinite line going through the start and end
 * points.  To find the closest point on the line segment itself see
 * {@see #getClosestSegmentPoint}.
 * @param {number|goog.math.Coordinate} x The x coordinate of the point, or
 *     a coordinate object.
 * @param {number=} opt_y The y coordinate of the point - required if x is a
 *     number, ignored if x is a goog.math.Coordinate.
 * @return {!goog.math.Coordinate} The point on the line closest to the given
 *     point.
 */
Line.prototype.getClosestPoint = function (x, opt_y) {
    return this.getInterpolatedPoint(
        this.closestInte_(x, opt_y));
};


/**
 * Computes the point on the line segment closest to a given point.
 * @param {number|goog.math.Coordinate} x The x coordinate of the point, or
 *     a coordinate object.
 * @param {number=} opt_y The y coordinate of the point - required if x is a
 *     number, ignored if x is a goog.math.Coordinate.
 * @return {!goog.math.Coordinate} The point on the line segment closest to the
 *     given point.
 */
Line.prototype.getClosestSegmentPoint = function (x, opt_y) {
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    };
    return this.getInterpolatedPoint(
        clamp(this.closestInte_(x, opt_y), 0, 1));
};


Object.assign(Line.prototype, {
    p0: function () {
        return {x: this.x0, y: this.y0}
    },
    p1: function () {
        return {x: this.x1, y: this.y1}
    }
});



 