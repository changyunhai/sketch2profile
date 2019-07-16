/**
 *
 * Sketch2Profile usage:
 *
 * sketch2profile.INIT( [curveLine, curveLine, curveArc, curveArc, ......] );
 * sketch2profile.BE();
 * var profiles=sketch2profile.BL();
 *
 * And Then get your profile by: profiles.LO object
 *
 */
var sketch2profile = (function () {

    function ArrayPushIfNotHas(arr, element) {
        if (arr && arr.indexOf(element) == -1) {
            arr.push(element);
            return true;
        } else return false;
    }

    var ided = (function () {
        var _id = 100;
        return function (obj) {
            obj.id = obj.id || (_id++);
            return obj.id;
        }
    })();


    var tol = 1e-10;//1cm

    var CURVES = [];// curves input.

    var VE = {};
    var CU = {};
    var ED = {};
    var MCUED = {};
    var LO = {};

    function INIT(curves) {
        CURVES = curves || [];

        VE = {};
        CU = {};
        ED = {};
        MCUED = {};
        LO = {};


        CURVES.forEach(function (curve) {
            console.assert(curve instanceof Curve);

            // points:
            var begin = curve.begin, end = curve.end, middle = curve.middle;
            var bpt = appendV(begin), ept = appendV(end), mpt = appendV(middle);

            // curves:
            var c = {
                type: curve.type, begin: bpt.id, end: ept.id, middle: mpt.id,
                id: curve.id, e: [], lerp: [], mcu: curve
            };
            //ArrayPushIfNotHas(bpt.c,c.id), ArrayPushIfNotHas(ept.c,c.id);
            CU[c.id] = c;
        });
    }

    function BE() {
        var curveIds = Object.keys(CU);
        // build the curve lerp:
        for (var i = 0; i < curveIds.length; ++i) {
            var c0 = CU[curveIds[i]];
            for (var j = i + 1; j < curveIds.length; ++j) {
                var c1 = CU[curveIds[j]], c0Model = findModel(c0.id), c1Model = findModel(c1.id);
                if (c0 == c1) continue;
                var intersectPts = c0Model.intersect(c1Model);
                intersectPts && intersectPts.forEach(function (pt) {
                    pt = appendV(pt);
                    var c0lerp = c0Model.getLerpNumber(pt), c1lerp = c1Model.getLerpNumber(pt);
                    if (c0lerp > tol && c0lerp < 1 - tol) ArrayPushIfNotHas(c0.lerp, pt.id);
                    if (c1lerp > tol && c1lerp < 1 - tol) ArrayPushIfNotHas(c1.lerp, pt.id);
                });
            }
        }

        for (var i = 0; i < curveIds.length; ++i) {
            // sort the curve lerp:
            var cu = CU[curveIds[i]], cuModel = findModel(cu.id);
            var lerp = cu.lerp.map(function (l) {
                return VE[l]
            });
            lerp = lerp.sort(function (p0, p1) {
                return cuModel.getLerpNumber(p0) - cuModel.getLerpNumber(p1);
            });
            cu.lerp = lerp.map(function (l) {
                return l.id
            });

            //console.log("build ed:" + i + ",curve=" + JSON.stringify(cu));
            // build ed:
            var cuVids = [cu.begin].concat(cu.lerp).concat([cu.end]);
            for (var j = 0; j < cuVids.length - 1; ++j) {
                var v1id = cuVids[j], v2id = cuVids[j + 1];
                var e = appendEd(v1id, v2id, cu.type, cu.middle);
                e.c = cu.id, ArrayPushIfNotHas(cu.e, e.id);
                ArrayPushIfNotHas(VE[v1id].e, e.id), ArrayPushIfNotHas(VE[v2id].e, e.id);
            }
        }
        return {VE: VE, CU: CU, ED: ED};
    }

    function BL() {
        buildMCUED();
        reloadCurve();
        removeDupEd();
        var dupEd = ED, mcued = MCUED;// unused.

        var borderEdInfo = undefined;
        do {
            makeManStr();
            var borderEdInfo = findBorderEd();
            if (borderEdInfo) {
                var loop = buildPf(borderEdInfo.vid, borderEdInfo.eid, borderEdInfo.side);
                var isDead = loop && (loop.e[loop.e.length - 1].id == loop.e[0].id);
                if (loop && !isDead) LO[ided(loop)] = loop;
                removeEd(borderEdInfo.eid);
            }
            DEBUG("buildPf");
        } while (borderEdInfo != undefined);
        return {VE: VE, ED: ED, LO: LO};
    }

    //-------private:
    function findModel(mid) {
        var models = CURVES.filter(function (curve) {
            return curve.id == mid;
        });
        console.assert(models.length == 1);
        return models[0];
    }

    function getTan(ed, pt) {
        var cu = MCUED[ed.nc];
        var tan = undefined;
        if (Math2d.IsSamePoint(cu.begin, pt, tol)) tan = cu.beginTangentOffset;
        else if (Math2d.IsSamePoint(cu.end, pt, tol)) tan = cu.endTangentOffset;
        else console.assert(false);
        tan = new Vec2(tan.x, tan.y).normalize();
        return tan;
    }

    function appendV(pt) {
        console.assert(isFinite(pt.x) && isFinite(pt.y));
        var p = {x: pt.x, y: pt.y, e: []};
        for (var id in VE) {
            var pv = VE[id];
            if (Math2d.IsSamePoint(p, pv, tol)) return pv;
        }
        VE[ided(p)] = p;
        return p;
    }

    function appendEd(p1id, p2id, type, mid) {
        var e = {v1: p1id, v2: p2id, type: type, c: undefined, mid: mid, p: []};
        var v1 = VE[p1id], v2 = VE[p2id];
        for (var id in ED) {
            var ed = ED[id];
            if (ed.type != type) continue;
            if (ed.mid != mid) continue;
            var edv2 = VE[ed.v2], edv1 = VE[ed.v1];
            if ((Math2d.IsSamePoint(edv2, v2, tol) && Math2d.IsSamePoint(edv1, v1, tol)) ||
                (Math2d.IsSamePoint(edv2, v1, tol) && Math2d.IsSamePoint(edv1, v2, tol))) {
                e = ed;
                break;
            }
        }
        ED[ided(e)] = e;
        return e;
    }

    //--- for BL:
    function buildMCUED() {
        for (var eid in ED) {
            var e = ED[eid];
            var oldC = findModel(e.c);
            var mcued = oldC.clone();
            mcued.oId = oldC.id;
            var begin = VE[e.v1], end = VE[e.v2], middle = VE[e.mid];
            mcued.begin = begin, mcued.end = end;
            if (oldC.center) mcued.center = oldC.center;

            //mcued.begin.x = begin.x, mcued.begin.y = begin.y;//todo bugs may happen here ......
            //mcued.end.x = end.x, mcued.end.y = end.y;
            //if (mcued instanceof CurveArc) {//todo bugs may happen here ......
            //    var oldCenter = oldC.center;
            //    mcued.center = oldCenter;
            //}
            e.nc = mcued.id, MCUED[mcued.id] = mcued;
        }
    }

    function removeDupEd() {
        var eIds = Object.keys(ED);
        for (var i = eIds.length - 1; i > 0; --i) {
            var checkE1 = ED[eIds[i]];
            for (var j = 0; j < i; ++j) {
                var checkE2 = ED[eIds[j]];
                if (!checkE1 || !checkE2) continue;
                var e1mcued = MCUED[checkE1.nc], e2mcued = MCUED[checkE2.nc];
                if (e1mcued && e2mcued && e1mcued.equals(e2mcued)) {
                    removeEd(checkE1.id);
                    break;
                }
            }
        }
    }

    function removeEd(eid) {
        var e = ED[eid];
        delete ED[eid];
        var ev1 = VE[e.v1], ev2 = VE[e.v2];
        var eIdxv1 = ev1.e.indexOf(eid), eIdxv2 = ev2.e.indexOf(eid);
        console.assert(eIdxv1 != -1 && eIdxv2 != -1);
        ev1.e.splice(eIdxv1, 1), ev2.e.splice(eIdxv2, 1);
        if (ev1.e.length == 0) delete VE[ev1.id];
        if (ev2.e.length == 0) delete VE[ev2.id];
        var cu = CU[e.c];
        cu.e.splice(cu.e.indexOf(eid), 1);
        return e;
    }

    function reloadCurve() {
    }

    function makeManStr() {
        function findNonManEd() {
            // if find one, return the ed id, and stop search.
            for (var vid in VE) {
                var vertex = VE[vid];
                if (vertex.e.length == 1) return vertex.e[0];
            }
        }

        do {
            var nonManEd = findNonManEd();
            if (nonManEd) removeEd(nonManEd);
        } while (nonManEd);
    }

    function findBorderEd() {
        // find all vertices:
        var allEdV = [];
        for (var eid in ED) {
            var ed = ED[eid];
            var edV1 = VE[ed.v1], edV2 = VE[ed.v2];
            var edMid = MCUED[ed.nc] && MCUED[ed.nc].middle;

            [edV1, edV2, edMid].forEach(function (pt) {
                if (!pt) return;
                var p = allEdV.find(function (edV) {
                    return Math2d.IsSamePoint(pt, edV, tol);
                });
                if (!p) allEdV.push(pt);
            });
        }

        //for (var eid in ED) view2d.drawText(eid, MCUED[ED[eid].nc].middle);

        var center = {x: 0, y: 0};
        allEdV.forEach(function (pt) {
            center.x += pt.x, center.y += pt.y;
        });
        center.x /= allEdV.length, center.y /= allEdV.length;
        var einfo = Object.keys(ED).map(function (eid) {
            var largest = 0, ed = ED[eid];
            var edV1 = VE[ed.v1], edV2 = VE[ed.v2];
            var edMid = MCUED[ed.nc] && MCUED[ed.nc].middle;
            [edV1, edV2, edMid].forEach(function (pt) {
                var len = Math2d.LineLength(pt, center);
                if (len > largest) largest = len;
            });
            return {eid: eid, maxDistance: largest};
        });
        var eids = einfo.sort(function (a, b) {
            return b.maxDistance - a.maxDistance;
        }).map(function (info) {
            return info.eid;
        });


        // check vertices in the same side of ed.(right)
        for (var i = 0; i < eids.length; ++i) {
            var ed = ED[eids[i]];
            var edVs = [VE[ed.v1], VE[ed.v2]];
            for (var e = 0; e < edVs.length; e++) {
                var edV = edVs[e], edTan = getTan(ed, edV);
                var anotherEdV = {x: edV.x + edTan.x * 10, y: edV.y + edTan.y * 10};
                var borderED = new CurveLine();
                borderED.begin = edV, borderED.end = anotherEdV;

                var allRight = true, allLeft = true, hasIntersect = false;
                for (var j = 0; j < eids.length; ++j) {
                    var checkED = ED[eids[j]];
                    if (ided(ed) == ided(checkED)) continue;
                    var intersects = borderED.intersect(MCUED[checkED.nc]);
                    intersects.forEach(function (intersect) {
                        if (!Math2d.IsSamePoint(intersect, edV, tol) &&
                            !Math2d.IsSamePoint(intersect, VE[checkED.v1], tol) &&
                            !Math2d.IsSamePoint(intersect, VE[checkED.v2], tol)) {
                            hasIntersect = true;
                        }
                    });
                    if (hasIntersect === true) break;
                    [VE[checkED.v1], VE[checkED.v2], MCUED[checkED.nc].middle].forEach(function (v) {
                        var side = Math2d.WhichSidePointOnLine(v, edV, anotherEdV);
                        if (side == "left") allRight = false;
                        else if (side == "right") allLeft = false;
                    });
                }
                if (hasIntersect == false && (allRight === true || allLeft === true)) {
                    //view2d.drawLines([[edV, anotherEdV]], 3, "orange");
                    return {eid: ed.id, vid: edV.id, side: (allRight ? "right" : "left")};
                }
            }
        }


        console.assert(Object.keys(ED).length == 0);
        return undefined;
    }

    function buildPf(startVId, edId, ptOnSide) {

        function turn(commonV, walkedEd) {// turn
            var fromTangent = getTan(walkedEd, commonV);
            var allEds = commonV.e.map(function (eId) {
                return ED[eId];
            });
            var rv = undefined, minTurnAngle = 361;
            for (var i = 0; i < allEds.length; ++i) {
                var ed = allEds[i];
                if (ided(ed) == ided(walkedEd)) continue;
                var toTangent = getTan(ed, commonV);
                var turnAngle = Math2d.LinelineCCWAngle({x: 0, y: 0}, fromTangent, toTangent);
                if (ptOnSide == "left") turnAngle = 360 - turnAngle;
                if (turnAngle < minTurnAngle) {
                    minTurnAngle = turnAngle;
                    rv = ed;
                }
            }
            return rv;
        }

        var walkEd = ED[edId], startV = VE[startVId];
        var profile = {v: [startV], e: [], nc: []};
        do {// walk!!
            var endV = (walkEd.v1 == ided(startV) ? VE[walkEd.v2] : VE[walkEd.v1]);
            var cued = MCUED[walkEd.nc];
            profile.e.push(walkEd);
            profile.v.push(endV);
            profile.nc.push(cued);
            walkEd = turn(endV, walkEd);
            startV = endV;
        } while (walkEd && ided(startV) != startVId);
        return profile;
    }

    //-----------------DP:
    var CB = undefined;

    function DEBUG(msg) {
        if (CB) CB(msg, {VE: VE, CU: CU, ED: ED, LO: LO, MCUED: MCUED, CURVES: CURVES});
    }

    function DP(callback) {
        if (callback) CB = callback;
    }


    return {INIT: INIT, BE: BE, BL: BL, DP: DP};
})();


