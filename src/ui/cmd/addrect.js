function CmdAddRect() {
    CS(this);

    this.top = undefined;//
    this.bottom = undefined;
    this.left = undefined;
    this.right = undefined;
};
CE(CmdAddRect, CmdAdd);
Object.assign(CmdAddRect.prototype, {
    begin: function () {
        CS(this, "begin");

        this.top = new CurveLine();
        this.right = new CurveLine();
        this.bottom = new CurveLine();
        this.left = new CurveLine();

        sceneAddModel(this.top);
        sceneAddModel(this.right);
        sceneAddModel(this.bottom);
        sceneAddModel(this.left);
    },

    setPoint: function (idx, pos, evt) {
        pos = CS(this, "setPoint", idx, pos, evt);
        if (idx == 0) {
            this.top.begin = this.top.end = pos;
            this.right.begin = this.right.end = pos;
            this.bottom.begin = this.bottom.end = pos;
            this.left.begin = this.left.end = pos;
        } else if (idx == 1) {
            this.movePoint(idx, pos, evt);
            System.cmdEnd();
        }
    },
    movePoint: function (idx, pos, evt) {
        pos = CS(this, "movePoint", idx, pos, evt);
        if (idx == 1) {
            var x = pos.x, y = pos.y;

            if (isFinite(x)) {
                this.top.ex = this.right.bx = x;
                this.right.ex = this.bottom.bx = x;
            }
            if (isFinite(y)) {
                this.right.ey = this.bottom.by = y;
                this.bottom.ey = this.left.by = y;
            }
        }
    }

});