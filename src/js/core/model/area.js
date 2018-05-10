function Area(opt) {
    CS(this, opt);
    defineValue(this, "points", []);
}
Area.prototype.type = "Area";
CE(Area, Entity);
Object.assign(Area.prototype, {
    toJSON: function () {
        var saved = CS(this, "toJSON");
        saved.type = "Area";
        saved.points = this.points;
        return saved;
    }, isValid: function () {
        return this.points.length > 3;
    }, getPolygon: function () {
        return this.points;
    }
});