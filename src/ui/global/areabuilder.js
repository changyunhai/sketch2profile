function buildArea() {
    var models = sceneAllModels();
    var curves = models.filter(function (entity) {
        return entity instanceof Curve;
    });
    var areas = models.filter(function (entity) {
        return entity instanceof Area;
    });
    sketch2profile.INIT(curves);
    var be = sketch2profile.BE();
    var profiles = sketch2profile.BL();
    var loops = profiles.LO, loopsIdx = 0;
    for (var loopId in loops) {
        var loop = loops[loopId];
        var vertices = loop.v.map(function (pt) {
            return {x: pt.x, y: pt.y};
        });
        var area = areas[loopsIdx++];
        if (!area) {
            area = new Area();
            sceneAddModel(area);
        }
        area.points = vertices;
    }
    for (var i = loopsIdx; i < areas.length; ++i) {
        var area = areas[i];
        sceneRemoveModel(area);
    }
}