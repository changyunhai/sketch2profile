function CmdSketcherMovePoint(model,modelPos) {
    CS(this);
    this.model = model;
    this.modelPos = modelPos;
    this.pointsInfo = undefined;
    this.arcFan = {};//arcFan will not changed.
}
CmdSketcherMovePoint.prototype.type = "CmdSketcherMovePoint".toUpperCase();

Object.assign(CmdSketcherMovePoint.prototype, {
    needViewportMouseMove2d: function () {
        return true;
    },
    begin: function () {
        var model = this.model;
        var modelPos = this.modelPos;
        var tol = 0.05;
        var pointsInfo = utilSketcherFindSamePoints(model, modelPos, tol);
        console.log("Same Points count=" + pointsInfo.length);
        this.model = model;//deprecated
        this.pointsInfo = pointsInfo;
        this.pointsInfo && this.pointsInfo.forEach(function (info) {
            var curve = info.curve;
            if (curve && curve.type == "SketcherCurveArc".toUpperCase()) this.arcFan[curve.id] = curve.fan;
        }, this);
    },
    end: function () {
        buildArea();
    },
    exe: function (cmd, evt, position, option) {
        
        if (cmd.indexOf("mousemove") != -1) {
            var pos = position, model = this.model, tol = 0.05;
            for (var i = 0, len = (this.pointsInfo && this.pointsInfo.length) || 0; i < len; ++i) {
                var pointInfo = this.pointsInfo[i];
                var field = pointInfo && pointInfo.field, curve = pointInfo && pointInfo.curve;
                if (field == "middle") {

                    if (curve.type == "CurveLine") {
                        var offset = utilSketcherCurveLineMoveMiddleRestriction(model.begin, model.end, pos);
                        var points = [].concat(utilSketcherFindSamePoints(model, model.begin, tol),
                            utilSketcherFindSamePoints(model, model.end, tol));
                        points = points.filter(function (item, idx, self) {
                            return true;
                        });
                        for (var i = 0; i < points.length; ++i) {
                            var point = points[i];
                            field = point.field, curve = point.curve;
                            var pos = {x: curve[field].x + offset.x, y: curve[field].y + offset.y};
                            curve[field] = pos;
                        }
                    }
                } else if (field == "begin" || field == "end") {
                        curve[field] = pos;
                }
            }
        }
    }
});




