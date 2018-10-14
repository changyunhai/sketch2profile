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


           var  area = new Loop();
           sceneAddModel(area);

        area.curves = loop.nc;
        //匹配相同区域
        var sameArea = areas.find(function(item){
            var lines = item.curves.filter(function(e){
                return e instanceof CurveLine;
            });
            var arcs = item.curves.filter(function(e){
                return e instanceof CurveArc;
            });
            var newLines = loop.nc.filter(function(e){
                return e instanceof CurveLine;
            });
            var newArcs = loop.nc.filter(function(e){
                return e instanceof CurveArc;
            });
            if(lines.length == newLines.length && arcs.length == newArcs.length){
                var lineIsSame = newLines.every(function(newline){
                    return lines.some(function(oldline){
                        return (Math2d.IsSamePoint(newline.begin,oldline.begin) && Math2d.IsSamePoint(newline.end,oldline.end)) ||
                            (Math2d.IsSamePoint(newline.end,oldline.begin) && Math2d.IsSamePoint(newline.begin,oldline.end));
                    });
                });
                var arcIsSame = newArcs.every(function(newArc){
                    return arcs.some(function(oldArc){
                        return (Math2d.IsSamePoint(newArc.begin,oldArc.begin) && Math2d.IsSamePoint(newArc.end,oldArc.end) && Math2d.IsSamePoint(newArc.center,oldArc.center)) ||
                            (Math2d.IsSamePoint(newArc.end,oldArc.begin) && Math2d.IsSamePoint(newArc.begin,oldArc.end) && Math2d.IsSamePoint(newArc.center,oldArc.center));
                    });
                });

                if(newLines.length == 0){
                    lineIsSame = true;
                }
                if(newArcs.length == 0){
                    arcIsSame = true;
                }
                return arcIsSame && lineIsSame;
            }
        });
        if(sameArea){
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
                if(otherLoop.containLoops.includes(loop)){
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