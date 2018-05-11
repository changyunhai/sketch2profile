startupUI([
    "ui/dialog/sketcher/sketcher_setting.xml"
]).then(function () {
    /////////
    // append templates first:
    $(".sketcherDialog .sketcherSettingBox .sweep").each(function () {
        $(this).append($(".sketcherDialogSettingDefinition .sweepDefinition").clone());
    });
    $(".sketcherDialog .sketcherSettingBox .extrude").each(function () {
        $(this).append($(".sketcherDialogSettingDefinition .extrudeDefinition").clone());
    });

    //-- commons:
    $(".sketcherDialog .sketcherSettingBox .close").on(click, function () {
        hideSketcherSettingBox();
    });


    // ---- area:
    $(".sketcherDialog .sketcherSettingBox .sketcherloop .delete").on(click, function () {
        var model = pickedModels();
        if (model) {

        }
    });
    $(".sketcherDialog .sketcherSettingBox .sketcherloop .resume").on(click, function () {


    });
    $(".sketcherDialog .sketcherSettingBox .sketcherloop .rebuild").on(click, function () {
        var area = pickedModels();

    });

    $(".sketcherDialog .sketcherSettingBox .sketcherloop .makeOffset").on(click, function () {
        var area = pickedModels().find(function (model) {
            return model instanceof Loop;
        });

        if (!area ) {
            layer.alert("当前没有选中区域");
            return;
        }

        return PopupValueInputDialogPromise("区域偏移", "请输入偏移值(mm)：", 100)
            .then(function (offset) {

                return Promise.resolve({offset: offset, createNew: true});
            }).then(function () {
            });

    });

    //--   curve line:
    $(".sketcherDialog .sketcherSettingBox .sketchercurveline .delete").on(click, function () {
        var model = pickedModels();
        if (model) {


        }
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurveline .toArc").on(click, function () {
        var lines = pickedModels();

    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurveline .split").on(click, function () {
        var line = pickedModels();
        var middle = line.middle, end = {x: line.end.x, y: line.end.y};
        line.end.x = middle.x, line.end.y = middle.y;


    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurveline .merge").on(click, function () {

    });


    //----  curve arc:
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .delete").on(click, function () {
        var model = pickedModels();
        if (model) {


        }
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toLine").on(click, function () {


    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toHalfArc").on(click, function () {
        var arc = pickedModels();
        var mid = {x:0,y:0};

        arc.mx = mid.x, arc.my = mid.y;
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toQuarterArc").on(click, function () {
        var arc = pickedModels();
        var mid = {x:0,y:0};
        arc.mx = mid.x, arc.my = mid.y;
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toAngledArc").on(click, function () {
        var arc = pickedModels();
        PopupValueInputDialogPromise("圆心角值", "请输入圆心角角度值(0~360)：", 90)
            .then(function (angle) {
                angle = parseFloat(angle);
                if (!isFinite(angle) || angle < 0 || angle > 360) {
                    return layer.alert("无效的圆心角度");
                }
                var mid = {x:0,y:0};

                arc.mx = mid.x, arc.my = mid.y;
            });
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .split").on(click, function () {

    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .merge").on(click, function () {

    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .flip").on(click, function () {
        var arc = pickedModels();
        var begin = arc.begin, end = arc.end, mid = arc.middle;
        var beginEnd_Mid = {x: (begin.x + end.x) / 2, y: (begin.y + end.y) / 2};
        arc.mx = beginEnd_Mid.x * 2 - mid.x, arc.my = beginEnd_Mid.y * 2 - mid.y;
    });



});
