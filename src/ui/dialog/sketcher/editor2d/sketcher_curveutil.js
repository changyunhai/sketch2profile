
function utilSketcherCurveLineMoveMiddleRestriction(begin, end, newMiddle) {
    var beginEnd_Mid = {x: (begin.x + end.x) / 2, y: (begin.y + end.y) / 2};
    var dir = {x: newMiddle.x - beginEnd_Mid.x, y: newMiddle.y - beginEnd_Mid.y};
    var normal = (new Vec2(end.y - begin.y, begin.x - end.x)).normalize();
    var offsetDistance = Vec2.dot(normal, dir), sign = Math.sign(offsetDistance);
    var offsetDirPoint = {x: beginEnd_Mid.x + normal.x * sign, y: beginEnd_Mid.y + normal.y * sign};
    if (Math2d.IsSamePoint(beginEnd_Mid, offsetDirPoint))return {x: 0, y: 0};
    var offset = Math2d.GetScaledPoint(beginEnd_Mid, offsetDirPoint, Math.abs(offsetDistance));
    return {x: offset.x - beginEnd_Mid.x, y: offset.y - beginEnd_Mid.y};
}


function utilSketcherFindSamePoints(curve, pt, tol) {
    var curves = ___globalScene.filter(function (e) {
        return e instanceof Curve;
    });
    if (curves.length == 0 || !pt)return [];
    console.assert(isFinite(pt.x) && isFinite(pt.y));
    var rv = [];
    curves.forEach(function (curve) {
        if (!curve.isValid())return;
        if (Math2d.IsSamePoint(curve.begin, pt, tol))rv.push({curve: curve, field: "begin"});
        if (Math2d.IsSamePoint(curve.end, pt, tol))rv.push({curve: curve, field: "end"});
        if (Math2d.IsSamePoint(curve.middle, pt, tol))rv.push({curve: curve, field: "middle"});
    });
    return rv;
}

function utilSketcherCurveLineToCurveArc(curveLine) {
    var arc = new CurveArc();
    arc.begin = {x:curveLine.begin.x,y:curveLine.begin.y} , arc.end = {x:curveLine.end.x,y:curveLine.end.y};
    var x = curveLine.middle.x, y = curveLine.middle.y;
    var radius = Vec2.difference(curveLine.end,curveLine.middle).magnitude();
    sceneAddModel(arc);
    arc.bx  = x - radius;
    arc.ex  = x + radius;
    arc.by  = arc.ey = y;
    arc.mx = x;
    arc.my = y + radius;
    sceneRemoveModel(curveLine);
    unpickModel(curveLine);
    return arc;
}

function utilSketcherMergeCurveLine(){
    var models = pickedModels();
    var lines = models.filter(function(e){
        return e instanceof CurveLine;
    });
    if(lines.length <= 1){
        layer.alert("请选中两条以上的直线。");
        return;
    }
    /*判断平行*/
    var angle1 = Math.atan2(lines[0].end.y - lines[0].begin.y,lines[0].end.x - lines[0].begin.x)/Math.PI * 180;
    angle1 = Math.abs(angle1);
    var isSameAngle = lines.every(function(line){
        var angle2 = Math.atan2(line.end.y - line.begin.y,line.end.x - line.begin.x)/Math.PI * 180;
        angle2 = Math.abs(angle2);
        if(Math.abs(angle1 - angle2) < 2 || Math.abs(angle1 - angle2) > 178){
            return true;
        }
    });
    if(!isSameAngle){
        layer.alert("请确保选中的直线平行。");
        return;
    }
    /*判断相邻*/
    var pointsNumber = [];
    lines.forEach(function(line){
        var begin = line.begin, end = line.end;
        var beginSame = pointsNumber.find(function(info){
            return Math2d.IsSamePoint(info.point,begin);
        });
        if(beginSame){
            beginSame.number ++;
        }else{
            pointsNumber.push({
                point:{x:begin.x,y:begin.y},
                number:1
            });
        }
        var endSame = pointsNumber.find(function(info){
            return Math2d.IsSamePoint(info.point,end);
        });
        if(endSame){
            endSame.number ++;
        }else{
            pointsNumber.push({
                point:{x:end.x,y:end.y},
                number:1
            });
        }

    });
    var oncePoints = pointsNumber.filter(function(info){
        return info.number == 1;
    });

    if(oncePoints.length !== 2){
        layer.alert("请确保选中的直线相邻。");
        return;
    }else{
        var newLine = new CurveLine();
        newLine.begin = oncePoints[0].point;
        newLine.end = oncePoints[1].point;
        sceneAddModel(newLine);
        lines.forEach(function(line){
            sceneRemoveModel(line);
            unpickModel(line);
        });
    }
}
