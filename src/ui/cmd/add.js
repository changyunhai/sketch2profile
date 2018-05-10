function CmdAdd() {
    CS(this);
    this.clickPoints = [];
    this.starter = {x: 0, y: 0};
}
CE(CmdAdd, CmdSnap);
Object.assign(CmdAdd.prototype, {
    end: function () {
        CS(this, "end");
        buildArea();
    },

    onMouseDown: function (evt, pos) {
        if (evt.button == 1) return;// mouse wheel click, pan the canvas.
        this.setPoint(this.clickPoints.length, pos, evt);
        this.clickPoints[this.clickPoints.length] = pos;
    },

    onMouseMove: function (evt, pos) {
        this.movePoint(this.clickPoints.length, pos, evt);
    },

    setPoint: function (idx, pos, evt) {
        return this.snapPoint(pos);
    },
    movePoint: function (idx, pos, evt) {
        var snapPt = this.snapPoint(pos);
        if (idx == 0)this.starter = snapPt;
        return snapPt;
    }
});