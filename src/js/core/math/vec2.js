/**
 * Class for a two-dimensional vector object and assorted functions useful for
 * manipulating points.
 *
 * @param {number} x The x coordinate for the vector.
 * @param {number} y The y coordinate for the vector.
 * @constructor
 * @extends {Point}
 */
function Vec2(x, y) {
    /**
     * X-value
     * @type {number}
     */
    this.x = x;

    /**
     * Y-value
     * @type {number}
     */
    this.y = y;
};


/**
 * @return {!Vec2} A random unit-length vector.
 */
Vec2.randomUnit = function () {
    var angle = Math.random() * Math.PI * 2;
    return new Vec2(Math.cos(angle), Math.sin(angle));
};


/**
 * @return {!Vec2} A random vector inside the unit-disc.
 */
Vec2.random = function () {
    var mag = Math.sqrt(Math.random());
    var angle = Math.random() * Math.PI * 2;

    return new Vec2(Math.cos(angle) * mag, Math.sin(angle) * mag);
};


/**
 * Returns a new Vec2 object from a given coordinate.
 * @param {!Point} a The coordinate.
 * @return {!Vec2} A new vector object.
 */
Vec2.fromCoordinate = function (a) {
    return new Vec2(a.x, a.y);
};


/**
 * @return {!Vec2} A new vector with the same coordinates as this one.
 * @override
 */
Vec2.prototype.clone = function () {
    return new Vec2(this.x, this.y);
};


/**
 * Returns the magnitude of the vector measured from the origin.
 * @return {number} The length of the vector.
 */
Vec2.prototype.magnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};


/**
 * Returns the squared magnitude of the vector measured from the origin.
 * NOTE(brenneman): Leaving out the square root is not a significant
 * optimization in JavaScript.
 * @return {number} The length of the vector, squared.
 */
Vec2.prototype.squaredMagnitude = function () {
    return this.x * this.x + this.y * this.y;
};


/**
 * @return {!Vec2} This coordinate after scaling.
 * @override
 */
Vec2.prototype.scale = function (sx, opt_sy) {
    var sy = opt_sy ? opt_sy : sx;
    this.x *= sx;
    this.y *= sy;
    return this;
};


/**
 * Reverses the sign of the vector. Equivalent to scaling the vector by -1.
 * @return {!Vec2} The inverted vector.
 */
Vec2.prototype.invert = function () {
    this.x = -this.x;
    this.y = -this.y;
    return this;
};


/**
 * Normalizes the current vector to have a magnitude of 1.
 * @return {!Vec2} The normalized vector.
 */
Vec2.prototype.normalize = function () {
    return this.scale(1 / this.magnitude());
};


/**
 * Adds another vector to this vector in-place.
 * @param {!Point} b The vector to add.
 * @return {!Vec2}  This vector with {@code b} added.
 */
Vec2.prototype.add = function (b) {
    this.x += b.x;
    this.y += b.y;
    return this;
};


/**
 * Subtracts another vector from this vector in-place.
 * @param {!Point} b The vector to subtract.
 * @return {!Vec2} This vector with {@code b} subtracted.
 */
Vec2.prototype.subtract = function (b) {
    this.x -= b.x;
    this.y -= b.y;
    return this;
};


/**
 * Rotates this vector in-place by a given angle, specified in radians.
 * @param {number} angle The angle, in radians.
 * @return {!Vec2} This vector rotated {@code angle} radians.
 */
Vec2.prototype.rotate = function (angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var newX = this.x * cos - this.y * sin;
    var newY = this.y * cos + this.x * sin;
    this.x = newX;
    this.y = newY;
    return this;
};


/**
 * Rotates a vector by a given angle, specified in radians, relative to a given
 * axis rotation point. The returned vector is a newly created instance - no
 * in-place changes are done.
 * @param {!Vec2} v A vector.
 * @param {!Vec2} axisPoint The rotation axis point.
 * @param {number} angle The angle, in radians.
 * @return {!Vec2} The rotated vector in a newly created instance.
 */
Vec2.rotateAroundPoint = function (v, axisPoint, angle) {
    var res = v.clone();
    return res.subtract(axisPoint).rotate(angle).add(axisPoint);
};


/**
 * Compares this vector with another for equality.
 * @param {!Vec2} b The other vector.
 * @return {boolean} Whether this vector has the same x and y as the given
 *     vector.
 */
Vec2.prototype.equals = function (b) {
    return this == b || !!b && this.x == b.x && this.y == b.y;
};


/**
 * Returns the sum of two vectors as a new Vec2.
 * @param {!Point} a The first vector.
 * @param {!Point} b The second vector.
 * @return {!Vec2} The sum vector.
 */
Vec2.sum = function (a, b) {
    return new Vec2(a.x + b.x, a.y + b.y);
};


/**
 * Returns the difference between two vectors as a new Vec2.
 * @param {!Point} a The first vector.
 * @param {!Point} b The second vector.
 * @return {!Vec2} The difference vector.
 */
Vec2.difference = function (a, b) {
    return new Vec2(a.x - b.x, a.y - b.y);
};


/**
 * Returns the dot-product of two vectors.
 * @param {!Point} a The first vector.
 * @param {!Point} b The second vector.
 * @return {number} The dot-product of the two vectors.
 */
Vec2.dot = function (a, b) {
    return a.x * b.x + a.y * b.y;
};


/**
 * Returns a new Vec2 that is the linear interpolant between vectors a and b at
 * scale-value x.
 * @param {!Point} a Vector a.
 * @param {!Point} b Vector b.
 * @param {number} x The proportion between a and b.
 * @return {!Vec2} The interpolated vector.
 */
Vec2.lerp = function (a, b, x) {
    function lerp(a, b, x) {
        return a + x * (b - a);
    }

    return new Vec2(lerp(a.x, b.x, x),
        lerp(a.y, b.y, x));
};


/*----------------- FOR exposure API --------------------------*/
Vec2.getRotAngle = function (base, from, to) {
    return utilMathLinelineCCWAngle(base, from, to);
};



 