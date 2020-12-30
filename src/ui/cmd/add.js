function CmdAdd() {
    CS(this);
    this.clickPoints = [];
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
        var pos = this.snapPoint(pos);
        this.movePoint(this.clickPoints.length, pos, evt);
        view2d.setMousePoint(pos);
    },

    setPoint: function (idx, pos, evt) {
        return this.snapPoint(pos);
    },
    movePoint: function (idx, pos, evt) {
        var snapPt = this.snapPoint(pos);
        return snapPt;
    }
});

//# sourceURL=file://ui/cmd/add.js