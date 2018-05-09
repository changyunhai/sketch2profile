startupUI([
    "ui/dialog/sketcher_dialog.xml"
]).then(function () {
    $(".sketcherDialog .main .shape_list .rectArea").on(click, function () {
        utilCmdBeginNoEnd("CmdSketcherAddRect".toUpperCase(), {
            host: SketcherEditor_svg.host,
            side: SketcherEditor_svg.side
        });
    });

    $(".sketcherDialog .main .shape_list .circleArea").on(click, function () {
        utilCmdBeginNoEnd("CmdSketcherAddCircle".toUpperCase(), {
            host: SketcherEditor_svg.host,
            side: SketcherEditor_svg.side
        });
    });

    $(".sketcherDialog .main .shape_list .line").on(click, function () {
        utilCmdBeginNoEnd("CmdSketcherAddLine".toUpperCase(), {
            host: SketcherEditor_svg.host,
            side: SketcherEditor_svg.side
        });
    });
    $(".sketcherDialog .main .shape_list .fillet").on(click, function () {
        layer.alert("尚未完成...");
        return;
    });
});

function popUpSketcherDialogPromise(curves) {
    var layerIndex = layer.open({
        type: 1,
        title: "自定义区域（Alpha预览版）",
        skin: 'layui-layer-grey',
        shade: 0,
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
            hideSketcherSettingBox();
        }, end: function () {
            hideSketcherSettingBox();
            $(".sketcherDialog").hide();
        }
    });
}


function showSketcherSettingBox(model) {
    $(".sketcherDialog .sketcherSettingBox").show();
    $(".sketcherDialog .sketcherSettingBox").children().hide();
    if (!model)return;
    $(".sketcherDialog .sketcherSettingBox ." + model.type.toLowerCase()).show();
}

function hideSketcherSettingBox() {
    $(".sketcherDialog .sketcherSettingBox").hide();
}
