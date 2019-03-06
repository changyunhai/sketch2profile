function utilSaveDocumentLocal() {
    var allModels = sceneAllModels();
    var str = allModels.map(function(model){
        return model.toJSON();
    });
    return JSON.stringify(str);
}

function utilLoadDocumentStr(content){
    hideSketcherSettingBox();
    sceneReset();
    var allModels = JSON.parse(content);

    allModels.forEach(function(model){
        if(model.type == "CurveLine"){
            var curve = new CurveLine();
            curve.fromJSON(model);
            sceneAddModel(curve);
        }else if(model.type == "CurveArc"){
            var curveArc = new CurveArc();
            curveArc.fromJSON(model);
            sceneAddModel(curveArc);
        }
    });

    if (!SketcherEditor_svg)initSketcherEditor();
    SketcherEditor_svg.show(sceneAllModels());
    allModels.forEach(function(model){
       if(model.type == "Loop"){
            var loop = new Loop();
            var allModels = sceneAllModels();
            loop.fromJSON(model,allModels);
            sceneAddModel(loop);
        }
    });

    var newAreas = sceneAllModels().filter(function (entity) {
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
    hideSketcherSettingBox();
    buildArea();
}