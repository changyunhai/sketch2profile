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
        layer.alert("尚未完成...");
        return;
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