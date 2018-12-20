startupUI([
    "ui/dialog/sketcher/sketcher_dialog.xml"
]).then(function () {
    $(".sketcherDialog .main .shape_list .rectArea").on(click, function () {
        System.cmdBegin(new CmdAddRect());
    });

    $(".sketcherDialog .main .shape_list .circleArea").on(click, function () {
        System.cmdBegin(new CmdAddCircle());
    });

    $(".sketcherDialog .main .shape_list .line").on(click, function () {
        System.cmdBegin(new CmdAddLine());
    });

    $(".sketcherDialog .main .shape_list .fillet").on(click, function () {
        var models = pickedModels();
        var isTwo = models.length == 2;
        var theSamePoint,arcBegin,arcEnd;
        var allIsLine = models.every(function(model){
            return model instanceof CurveLine;
        });
        if(!isTwo || !allIsLine){
            layer.alert("请选择两条直线！");
            return;
        }
        var oneLine = models[0],twoLine = models[1];
        if(Math2d.IsSamePoint(oneLine.begin,twoLine.begin,0.01)){
            theSamePoint = oneLine.begin;
            arcBegin = Math2d.GetScaledPoint(oneLine.begin,oneLine.end,0.2);
            arcEnd = Math2d.GetScaledPoint(twoLine.begin,twoLine.begin,0.2);
            oneLine.begin = arcBegin;
            twoLine.begin = arcEnd;
        }else if(Math2d.IsSamePoint(oneLine.begin,twoLine.end,0.01)){
            theSamePoint = oneLine.begin;
            arcBegin = Math2d.GetScaledPoint(oneLine.begin,oneLine.end,0.2);
            arcEnd = Math2d.GetScaledPoint(twoLine.end,twoLine.begin,0.2);
            oneLine.begin = arcBegin;
            twoLine.end = arcEnd;
        }else if(Math2d.IsSamePoint(oneLine.end,twoLine.begin,0.01)){
            theSamePoint =oneLine.end;
            arcBegin = Math2d.GetScaledPoint(oneLine.end,oneLine.begin,0.2);
            arcEnd = Math2d.GetScaledPoint(twoLine.begin,twoLine.end,0.2);
            oneLine.end = arcBegin;
            twoLine.begin = arcEnd;
        }else if(Math2d.IsSamePoint(oneLine.end,twoLine.end,0.01)){
            theSamePoint = oneLine.end;
            arcBegin = Math2d.GetScaledPoint(oneLine.end,oneLine.begin,0.2);
            arcEnd = Math2d.GetScaledPoint(twoLine.end,twoLine.begin,0.2);
            oneLine.end = arcBegin;
            twoLine.end = arcEnd;
        }
        if(theSamePoint){
            var arc = new CurveArc();
            arc.begin = arcBegin;
            arc.end = arcEnd;
            sceneAddModel(arc);
            var mid = utilSketcherCurveArcGetMiddleByFanAngle(arc.begin, arc.end, 90, Math2d.RotatePointCW(arc.begin, arc.end, 45));
            arc.mx = mid.x;
            arc.my = mid.y;
            buildArea();
        }else{
            layer.alert("请确保两条直线相邻！");
        }

    });


    //-- commons:
    $(".sketcherDialog .sketcherSettingBox .close").on(click, function () {
        hideSketcherSettingBox();
    });


    // ---- loop:
    $(".sketcherDialog .sketcherSettingBox .sketcherloop .delete").on(click, function () {
        var model = pickedModels();
        if (model) {
            layer.alert("尚未完成...");
        }
    });
    $(".sketcherDialog .sketcherSettingBox .sketcherloop .resume").on(click, function () {
        layer.alert("尚未完成...");

    });
    $(".sketcherDialog .sketcherSettingBox .sketcherloop .rebuild").on(click, function () {
        var area = pickedModels();
        layer.alert("尚未完成...");
    });

    $(".sketcherDialog .sketcherSettingBox .sketcherloop .makeOffset").on(click, function () {
        var area = pickedModels().find(function (model) {
            return model instanceof Loop;
        });

        if (!area) {
            layer.alert("当前没有选中区域");
            return;
        }

        return PopupValueInputDialogPromise("区域偏移", "请输入偏移值(mm)：", 100)
            .then(function (offset) {
                layer.alert("尚未完成...");
                return Promise.resolve({offset: offset, createNew: true});
            }).then(function () {
            });

    });


    //--   curve line:
    $(".sketcherDialog .sketcherSettingBox .sketchercurveline .delete").on(click, function () {
        var models = pickedModels();
        var lines = models.filter(function(e){
            return e instanceof CurveLine;
        });
        lines.forEach(function(line){
            sceneRemoveModel(line);
            unpickModel(line);
        });
        buildArea();
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurveline .toArc").on(click, function () {
        var models = pickedModels();
        var lines = models.filter(function(e){
            return e instanceof CurveLine;
        });
        lines.forEach(function(line){
            var arc = utilSketcherCurveLineToCurveArc(line);
        });
        buildArea();
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurveline .split").on(click, function () {
        var models = pickedModels();
        var lines = models.filter(function(e){
            return e instanceof CurveLine;
        });
        lines.forEach(function(line){
            var middle = line.middle, end = {x: line.end.x, y: line.end.y};
            line.end = {x:middle.x,y:middle.y};
            var newLine = new CurveLine();
            newLine.begin = {x:middle.x,y:middle.y};
            newLine.end = end;
            newLine.oId = line.oId;
            sceneAddModel(newLine);
            unpickModel(line);
        });
        buildArea();
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurveline .merge").on(click, function () {
        utilSketcherMergeCurveLine();
        buildArea();
    });


    //----  curve arc:
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .delete").on(click, function () {
        var models = pickedModels();
        var arcs = models.filter(function(e){
            return e instanceof CurveArc;
        });
        arcs.forEach(function(arc){
            sceneRemoveModel(arc);
            unpickModel(arc);
        });
        buildArea();
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toLine").on(click, function () {
        var models = pickedModels();
        var arcs = models.filter(function(e){
            return e instanceof CurveArc;
        });
        arcs.forEach(function(arc){
            var line = utilSketcherCurveArcToCurveLine(arc);
        });
        buildArea();

    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toHalfArc").on(click, function () {
        var models = pickedModels();
        var arcs = models.filter(function(e){
            return e instanceof CurveArc;
        });
        arcs.forEach(function(arc){
            var mid = utilSketcherCurveArcGetMiddleByFanAngle(arc.begin, arc.end, 180, arc.middle);
            arc.mx = mid.x, arc.my = mid.y;
        });
        buildArea();
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toQuarterArc").on(click, function () {
        var models = pickedModels();
        var arcs = models.filter(function(e){
            return e instanceof CurveArc;
        });
        arcs.forEach(function(arc){
            var mid = utilSketcherCurveArcGetMiddleByFanAngle(arc.begin, arc.end, 90, arc.middle);
            arc.mx = mid.x, arc.my = mid.y;
        });
        buildArea();
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toAngledArc").on(click, function () {
        var models = pickedModels();
        var arcs = models.filter(function(e){
            return e instanceof CurveArc;
        });
        PopupValueInputDialogPromise("圆心角值", "请输入圆心角角度值(0~360)：", 90)
            .then(function (angle) {
                angle = parseFloat(angle);
                if (!isFinite(angle) || angle < 0 || angle > 360) {
                    return layer.alert("无效的圆心角度");
                }
                arcs.forEach(function(arc){
                    var mid = utilSketcherCurveArcGetMiddleByFanAngle(arc.begin, arc.end, angle, arc.middle);
                    arc.mx = mid.x, arc.my = mid.y;
                });
                buildArea();
            });
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toRadiusArc").on(click, function () {
        var models = pickedModels();
        var arcs = models.filter(function(e){
            return e instanceof CurveArc;
        });
        PopupValueInputDialogPromise("圆弧半径", "请输入圆弧的半径：", 1)
            .then(function (radius) {
                arcs.forEach(function(arc){
                    var begin = arc.begin,end = arc.end;
                    var beginEnd_Mid = {x: (begin.x + end.x) / 2, y: (begin.y + end.y) / 2};
                    var minRadius = Math2d.LineLength(beginEnd_Mid, begin);
                    if(radius < minRadius) return false;
                    var angle = Math2d.utilMathToDegree(Math.asin(minRadius/radius)) * 2;
                    var mid = utilSketcherCurveArcGetMiddleByFanAngle(begin, end, angle, arc.middle);
                    arc.mx = mid.x, arc.my = mid.y;
                });
                buildArea();
            });
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .split").on(click, function () {
        var models = pickedModels();
        var arcs = models.filter(function(e){
            return e instanceof CurveArc;
        });
        arcs.forEach(function(arc){
            var begin = arc.begin,end = arc.end,middle = arc.middle,center = arc.center;
            arc.end = {x:middle.x,y:middle.y};
            arc.center = center;
            var newArc = new CurveArc();
            newArc.begin = {x:middle.x,y:middle.y} , newArc.end = {x:end.x,y:end.y};
            newArc.center = center;
            newArc.oId = arc.oId;
            sceneAddModel(newArc);
            unpickModel(arc);
        });
        buildArea();
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .merge").on(click, function () {
        var models = pickedModels();
        var isTwo = models.length == 2;
        var theSamePoint,arcBegin,arcEnd;
        var allIsArc = models.every(function(model){
            return model instanceof CurveArc;
        });
        if(!isTwo || !allIsArc){
            layer.alert("请选择两条圆弧！");
            return;
        }
        var oneArc = models[0],twoArc = models[1];
        if(!Math2d.IsSamePoint(oneArc.center,twoArc.center,0.01)){
            layer.alert("请选择同心圆！");
            return;
        }
        if(Math2d.IsSamePoint(oneArc.begin,twoArc.begin,0.01)){
            theSamePoint = oneArc.begin;
            arcBegin = oneArc.end;
            arcEnd = twoArc.end;
        }else if(Math2d.IsSamePoint(oneArc.begin,twoArc.end,0.01)){
            theSamePoint = oneArc.begin;
            arcBegin = oneArc.end;
            arcEnd = twoArc.begin;
        }else if(Math2d.IsSamePoint(oneArc.end,twoArc.begin,0.01)){
            theSamePoint =oneArc.end;
            arcBegin = oneArc.begin;
            arcEnd = twoArc.end;
        }else if(Math2d.IsSamePoint(oneArc.end,twoArc.end,0.01)){
            theSamePoint = oneArc.end;
            arcBegin = oneArc.begin;
            arcEnd = twoArc.begin;
        }
        if(theSamePoint){
            var arcs = models.filter(function(e){
                return e instanceof CurveArc;
            });
            arcs.forEach(function(arc){
                sceneRemoveModel(arc);
                unpickModel(arc);
            });
            var arc = new CurveArc();
            arc.begin = arcBegin;
            arc.end = arcEnd;
            sceneAddModel(arc);
            var mid = utilSketcherCurveArcGetMiddleByFanAngle(arcBegin, arcEnd, oneArc.fan + twoArc.fan, theSamePoint);
            arc.mx = mid.x;
            arc.my = mid.y;
            buildArea();
        }else{
            layer.alert("请确保两条圆弧相邻！");
        }
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .flip").on(click, function () {
        var models = pickedModels();
        var arcs = models.filter(function(e){
            return e instanceof CurveArc;
        });
        arcs.forEach(function(arc){
            var begin = arc.begin, end = arc.end, mid = arc.middle;
            var beginEnd_Mid = {x: (begin.x + end.x) / 2, y: (begin.y + end.y) / 2};
            arc.mx = beginEnd_Mid.x * 2 - mid.x, arc.my = beginEnd_Mid.y * 2 - mid.y;
        });
        buildArea();
    });

});


function popUpSketcherDialogPromise(curves) {
    // build scene:
    for (var i = 0; i < (curves && curves.length - 1 || 0); ++i) {
        var p0 = curves[i], p1 = curves[i + 1];
        var curve = new CurveLine();
        curve.begin = p0, curve.end = p1;
        sceneAddModel(curve);
    }

    var layerIndex = layer.open({
        type: 1,
        title: "由草图生成区域（Alpha预览版）",
        skin: 'layui-layer-grey',
        shade: 0.2,
        shadeClose: false,
        maxmin: false,
        move: false,
        offset: ['60px', '250px'],
        area: [window.innerWidth - 500 + 'px', window.innerHeight - 120 + 'px'],
        content: $(".sketcherDialog"),
        success: function () {
            var parent = $(".sketcherDialog").parents(".layui-layer-grey");
            if (parent.draggable)parent.draggable({
                distance: 10, handle: ".layui-layer-title"
            }).css("z-index", 1000).find(".layui-layer-title").attr("style", "cursor:move;");

            $(".sketcherDialog .right").css("width", window.innerWidth - 770 + "px");
            if (!SketcherEditor_svg)initSketcherEditor();
            SketcherEditor_svg.show(sceneAllModels());
            buildArea();
            hideSketcherSettingBox();
        }, end: function () {
            hideSketcherSettingBox();
            $(".sketcherDialog").hide();
            sceneReset();
        }
    });
}


function showSketcherSettingBox(models) {
    $(".sketcherDialog .sketcherSettingBox").show();
    $(".sketcherDialog .sketcherSettingBox").children().hide();
    console.assert(models.length > 0);
    models.forEach(function (model) {
        $(".sketcherDialog .sketcherSettingBox .sketcher" + model.type.toLowerCase()).show();
    });
}

function hideSketcherSettingBox() {
    $(".sketcherDialog .sketcherSettingBox").hide();
}

pickedChangedEvt.add(function (picks, op, model) {
    if (picks.length == 0)hideSketcherSettingBox();
    else showSketcherSettingBox(picks);
});

