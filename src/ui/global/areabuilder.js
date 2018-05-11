function buildArea() {
    var models = sceneAllModels();
    var curves = models.filter(function (entity) {
        return entity instanceof Curve;
    });
    var areas = models.filter(function (entity) {
        return entity instanceof Loop;
    });
    var s2p = sketch2profile;
    s2p.INIT(curves);
    var be = s2p.BE();
    var profiles = s2p.BL();
    var loops = profiles.LO, loopsIdx = 0;

    for (var loopId in loops) {
        var loop = loops[loopId];
        var vertices = loop.v.map(function (pt) {
            return {x: pt.x, y: pt.y};
        });
        var area = areas[loopsIdx++];
        if (!area) {
            area = new Loop();
            sceneAddModel(area);
        }
        area.curves = loop.nc;
    }
    for (var i = loopsIdx; i < areas.length; ++i) {
        var area = areas[i];
        sceneRemoveModel(area);
    }
}