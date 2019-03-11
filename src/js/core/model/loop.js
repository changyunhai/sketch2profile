function Loop(opt) {
    CS(this, opt);
    defineValue(this, "curves", []);
    defineValue(this, "containLoops",[]);
}
Loop.prototype.type = "Loop";
CE(Loop, Entity);
Object.assign(Loop.prototype, {
    toJSON: function () {
        var saved = CS(this, "toJSON");
        saved.type = "Loop";//todo curves
        saved.curves = this.curves.map(function(item){
            return item.id;
        });
        return saved;
    }, fromJSON:function(t,e){
        CS(this, "fromJSON",t,e);
        var allModels = e || sceneAllModels();
        this.curves = t.curves.map(function(item){
            return allModels.find(function(model){
                return model.id == item;
            });
        });
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
            if(poly.length > 0){
                if(Math2d.IsSamePoint(poly[poly.length - 1],curvePoly[0])){

                }else{
                    curvePoly.reverse();
                    if(!Math2d.IsSamePoint(poly[poly.length - 1],curvePoly[0])){
                        console.error("Error: not closed polygon.")
                    }
                }
            }
            Array.prototype.push.apply(poly, curvePoly);
        }
        poly = Math2d.PointsMakeNormalize(poly);
        return poly.reverse();
    }
});