function CmdAddRect() {
    CS(this);

    this.top = undefined;//
    this.bottom = undefined;
    this.left = undefined;
    this.right = undefined;
    this.points = [];
};
CE(CmdAddRect, CmdBase);
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
    end: function () {
        CS(this, "end");
        buildArea();
    },

    onMouseDown: function (evt, pos) {
        if (evt.button == 1) {
            return;// mouse wheel click, pan the canvas.
        }
        var firstPoint = this.points[0];

        if (firstPoint == undefined) {
            var x = pos.x, y = pos.y;
            firstPoint = this.points[0] = {x: x, y: y};

            this.top.bx = this.top.ex = x;
            this.top.by = this.top.ey = y;

            this.bottom.bx = this.bottom.ex = x;
            this.bottom.by = this.bottom.ey = y;

            this.left.bx = this.left.ex = x;
            this.left.by = this.left.ey = y;

            this.right.bx = this.right.ex = x;
            this.right.by = this.right.ey = y;
        } else {
            this._moveSecondPoint(pos);
            this.points[1] = pos;
            System.cmdEnd();
        }
    },

    onMouseMove: function (evt, pos) {
        var firstPoint = this.points[0];
        if (!firstPoint) return;
        this._moveSecondPoint(pos);
    },

    onMouseUp: function (evt, pos) {
    },

    //---private:
    _moveSecondPoint: function (pos) {
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
});