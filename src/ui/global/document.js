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

    /*buildArea();*/
    hideSketcherSettingBox();

}