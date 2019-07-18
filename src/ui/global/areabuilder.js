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
    SketcherEditor_svg.clearProfilesLayer();
    models.filter(function (entity) {
        return entity instanceof Curve;
    }).forEach(function(entity){
        entity.flag = 0;
    });
    for (var loopId in loops) {
        var loop = loops[loopId];
        var vertices = loop.v.map(function (pt) {
            return {x: pt.x, y: pt.y};
        });


        var area = new Loop();
        sceneAddModel(area);

        area.curves = loop.nc;
        area.vertices = loop.v;
        //匹配相同区域
        var sameArea = areas.find(function (item) {
            return item.curves.every(function (curve) {
                var newCurves = loop.nc.filter(function (e) {
                    return curve&&e&&e.oId == curve.id;
                });
                return newCurves.length == 1;
            });
        });
        if (sameArea && sameArea.curves.length == loop.nc.length) {
            area.id = sameArea.id;
        }
    }

    for (var i = loopsIdx; i < areas.length; ++i) {
        var area = areas[i];
        sceneRemoveModel(area);
    }

    var newAreas = models.filter(function (entity) {
        return entity instanceof Loop;
    });

    newAreas.forEach(function(area){
        var polygon = area.getPolygon();
        newAreas.forEach(function(otherArea){
            if(area == otherArea ) return;
            var otherPolygon = otherArea.getPolygon();
            var isInPolygon = otherPolygon.every(function(point){
                 return  Math2d.IsPointInPoly(polygon, point);
            });
            isInPolygon && area.containLoops.push(otherArea);
        });
    });

    newAreas.forEach(function(area){
        var removeLoop = [];
        area.containLoops.forEach(function(loop){
            area.containLoops.forEach(function(otherLoop){
                if(otherLoop.containLoops.includes(loop) && !removeLoop.includes(loop)){
                    removeLoop.push(loop);
                }
            });
        });
        removeLoop.forEach(function(loop){
            var index = area.containLoops.indexOf(loop);
            area.containLoops.splice(index,1);
        });
    });
}