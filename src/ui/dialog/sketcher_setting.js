startupUI([
    "ui/dialog/sketcher_setting.xml"
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
    $(".sketcherDialog .sketcherSettingBox .sketcherarea .delete").on(click, function () {
        var model = pickedModel();
        if (model) {
            //todo Contextmenu_delete(model);
            utilSketcherRebuildArea(model.host, model.side);
        }
    });
    $(".sketcherDialog .sketcherSettingBox .sketcherarea .resume").on(click, function () {
        utilSketcherResumeArea(SketcherEditor_svg.host, SketcherEditor_svg.side, SketcherEditor_svg.outline);
    });
    $(".sketcherDialog .sketcherSettingBox .sketcherarea .rebuild").on(click, function () {
        var area = pickedModel();
        if (area && area.host)utilSketcherRebuildArea(area.host, area.side);
    });

    $(".sketcherDialog .sketcherSettingBox .sketcherarea .makeOffset").on(click, function () {
        var area = pickedModel();

        if (!area || !area.host) {
            layer.alert("当前没有选中区域");
            return;
        }
        return layer.alert("尚未完成...");

        return PopupValueInputDialogPromise("区域偏移", "请输入偏移值(mm)：", 100)
            .then(function (offset) {
                utilSketcherAreaOffset(area, offset);
                return Promise.resolve({offset: offset, createNew: true});
            }).then(function () {
            });

        return utilCmdBeginNoEnd("CmdSketcherMakeOffset".toUpperCase(), {
            host: SketcherEditor_svg.host,
            side: SketcherEditor_svg.side
        }, area);
    });

    //--   curve line:
    $(".sketcherDialog .sketcherSettingBox .sketchercurveline .delete").on(click, function () {
        var model = pickedModel();
        if (model) {
            Contextmenu_delete(model);
            utilSketcherRebuildArea(model.host, model.side);
        }
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurveline .toArc").on(click, function () {
        var line = pickedModel();
        var arc = utilSketcherCurveLineToCurveArc(line);
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurveline .split").on(click, function () {
        var line = pickedModel();
        var middle = line.middle, end = {x: line.end.x, y: line.end.y};
        line.end.x = middle.x, line.end.y = middle.y;
        api.cmdBegin(api.cmdCreate("CmdSketcherAddLine".toUpperCase(), {host: line.host, side: line.side}));
        api.cmdExe("mousedown_sketcher2d", {}, {x: middle.x, y: middle.y});
        api.cmdExe("mousedown_sketcher2d", {}, {x: end.x, y: end.y});
        api.cmdEnd();
        //utilSketcherRebuildArea(line.host, line.side);
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurveline .merge").on(click, function () {

    });


    //----  curve arc:
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .delete").on(click, function () {
        var model = pickedModel();
        if (model) {
            Contextmenu_delete(model);
            utilSketcherRebuildArea(model.host, model.side);
        }
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toLine").on(click, function () {
        var arc = pickedModel();
        var line = utilSketcherCurveArcToCurveLine(arc);
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toHalfArc").on(click, function () {
        var arc = pickedModel();
        var mid = utilSketcherCurveArcGetMiddleByFanAngle(arc.begin, arc.end, 180, arc.middle);
        arc.mx = mid.x, arc.my = mid.y;
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toQuarterArc").on(click, function () {
        var arc = pickedModel();
        var mid = utilSketcherCurveArcGetMiddleByFanAngle(arc.begin, arc.end, 90, arc.middle);
        arc.mx = mid.x, arc.my = mid.y;
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .toAngledArc").on(click, function () {
        var arc = pickedModel();
        PopupValueInputDialogPromise("圆心角值", "请输入圆心角角度值(0~360)：", 90)
            .then(function (angle) {
                angle = parseFloat(angle);
                if (!isFinite(angle) || angle < 0 || angle > 360) {
                    return layer.alert("无效的圆心角度");
                }
                var mid = utilSketcherCurveArcGetMiddleByFanAngle(arc.begin, arc.end, angle, arc.middle);
                arc.mx = mid.x, arc.my = mid.y;
            });
    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .split").on(click, function () {

    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .merge").on(click, function () {

    });
    $(".sketcherDialog .sketcherSettingBox .sketchercurvearc .flip").on(click, function () {
        var arc = pickedModel();
        var begin = arc.begin, end = arc.end, mid = arc.middle;
        var beginEnd_Mid = {x: (begin.x + end.x) / 2, y: (begin.y + end.y) / 2};
        arc.mx = beginEnd_Mid.x * 2 - mid.x, arc.my = beginEnd_Mid.y * 2 - mid.y;
    });


    // extrude:
    $(".sketcherDialog .sketcherSettingBox .extrude .delete").on(click, function () {
        var area = pickedModel();
        var AreaExtrudeModel = api.entityTraverseFilter(function (e) {
            return e.type == "AreaExtrusion".toUpperCase();
        }).find(function (e) {
            return e.mother == area;
        });
        if (area)Contextmenu_delete(AreaExtrudeModel);
    });
    $(".sketcherDialog .sketcherSettingBox .extrude .apply").on(click, function () {
        var _domContainer = $(this).parents(".extrude");
        var parameterNames = ["height3d", "offset"];
        var area = pickedModel();
        var AreaExtrudeModel = api.entityTraverseFilter(function (e) {
            return e.type == "AreaExtrusion".toUpperCase();
        }).find(function (e) {
            return e.mother == area;
        });
        if (!AreaExtrudeModel) {
            AreaExtrudeModel = new AreaExtrusion();
            AreaExtrudeModel.setMother(area);
            api.entityAddLink(application.doc.scene, AreaExtrudeModel);
        }
        parameterNames.forEach(function (name) {
            AreaExtrudeModel[name] = parseFloat(_domContainer.find("." + name).val()) / 1000;
        });
        api.modelChangeFlag(AreaExtrudeModel, Constant.MODELFLAG_FORCE_UPDATE);
    });

    // sweep:
    $(".sketcherDialog .sketcherSettingBox .sweep .crossSectionSelect").on(click, function () {//截面选择
        var type = "jiaoxian";//todo
        var catalog = ProductSelectCatalog[type];
        PopupProductSelectDialogPromise([], catalog, [catalog]).then(function (data) {

        });
    });
    $(".sketcherDialog .sketcherSettingBox .sweep .crossSectionRotate").on(click, function () {
        layer.alert("尚未完成...");
    });
    $(".sketcherDialog .sketcherSettingBox .sweep .crossSectionFlip").on(click, function () {
        layer.alert("尚未完成...");
    });
    $(".sketcherDialog .sketcherSettingBox .sweep .delete").on(click, function () {
        var area = pickedModel();
        var areaSweepModel = api.entityTraverseFilter(function (e) {
            return e.type == "AreaSweep".toUpperCase();
        }).find(function (e) {
            return e.mother == area;
        });
        if (areaSweepModel)Contextmenu_delete(areaSweepModel);
    });
    $(".sketcherDialog .sketcherSettingBox .sweep .apply").on(click, function () {
        var _domContainer = $(this).parents(".sweep");
        var parameterNames = ["width", "height", "width_offset", "height_offset"];
        var pid = "pD78kU7oFczgzmviKpXn";
        var areaSweepModel = undefined;
        var area = pickedModel();

        return Promise.resolve()
            .then(function () {
                areaSweepModel = api.entityTraverseFilter(function (e) {
                    return e.type == "AreaSweep".toUpperCase();
                }).find(function (e) {
                    return e.mother == area;
                });
                if (areaSweepModel && areaSweepModel.pid == pid)return Promise.resolve();
                else {
                    if (!areaSweepModel) {
                        areaSweepModel = new AreaSweep();
                        areaSweepModel.setMother(area);
                        api.entityAddLink(application.doc.scene, areaSweepModel);
                    }
                    areaSweepModel.pid = pid;
                    return api.ajaxFloorplanGetProductMetaPromise([pid]);
                }
            }).then(function (metas) {
                var meta = metas && metas[pid];
                var extra = meta && meta.extra && JSON.parse(meta.extra);
                var profile = extra && extra.profile;
                if (profile) areaSweepModel.points = profile;
                parameterNames.forEach(function (name) {
                    areaSweepModel[name] = parseFloat(_domContainer.find("." + name).val()) / 1000;
                });
                api.modelChangeFlag(areaSweepModel, Constant.MODELFLAG_FORCE_UPDATE);
            });

    });
});
