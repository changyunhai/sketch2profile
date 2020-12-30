function CmdAddCircle() {
    CS(this);

    this.top = undefined;//
    this.bottom = undefined;
}
CE(CmdAddCircle, CmdAdd);
Object.assign(CmdAddCircle.prototype, {
    begin: function () {
        CS(this, "begin");

        this.top = new CurveArc();
        this.bottom = new CurveArc();

        sceneAddModel(this.top);
        sceneAddModel(this.bottom);
    },

    setPoint: function (idx, pos, evt) {
        pos = CS(this, "setPoint", idx, pos, evt);
        if (idx == 0) {
            this.top.begin = this.top.end = pos;
            this.bottom.begin = this.bottom.end = pos;
        } else if (idx == 1) {
            this.movePoint(idx, pos, evt);
            System.cmdEnd();
        }
    },
    movePoint: function (idx, pos, evt) {
        pos = CS(this, "movePoint", idx, pos, evt);
        if (idx == 1) {
            var firstPoint = this.clickPoints[0];
            var x = firstPoint.x, y = firstPoint.y;
            var radius = Vec2.difference(pos, firstPoint).magnitude();
            this.top.bx = this.bottom.ex = x - radius;
            this.top.ex = this.bottom.bx = x + radius;
            this.top.by = this.bottom.ey = this.top.ey = this.bottom.by = y;
            this.top.mx = this.bottom.mx = x;
            this.top.my = y + radius, this.bottom.my = y - radius;
        }
    }

});

//# sourceURL=file://ui/cmd/addcircle.js