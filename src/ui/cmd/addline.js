function CmdAddLine() {
    CS(this);
    this.line = undefined;
}
CE(CmdAddLine, CmdAdd);
Object.assign(CmdAddLine.prototype, {
    begin: function () {
        CS(this, "begin");

        this.line = new CurveLine();
        sceneAddModel(this.line);
    },

    setPoint: function (idx, pos, evt) {
        pos = CS(this, "setPoint", idx, pos, evt);
        if (idx == 0) {
            this.line.begin = pos;
        } else if (idx == 1) {
            this.line.end = pos;
            System.cmdEnd();
        }
    },
    movePoint: function (idx, pos, evt) {
        pos = CS(this, "movePoint", idx, pos, evt);
        if (idx == 1)this.line.end = pos;
    }
});