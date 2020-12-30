function CmdAddLine() {
    CS(this);
   /* this.line = undefined;*/
}
CE(CmdAddLine, CmdAdd);
Object.assign(CmdAddLine.prototype, {
    _createLine : function(){
        var line = new CurveLine();
        sceneAddModel(line);
        return line;
    },
    begin: function () {
        CS(this, "begin");
        this.line = this._createLine();

    },

    setPoint: function (idx, pos, evt) {
        pos = CS(this, "setPoint", idx, pos, evt);
        if (idx == 0) {
            this.line.begin = pos;
        } else {
            this.line.end = pos;
        }
        if (evt.button == 2) {// right click
            sceneRemoveModel(this.line);
            unpickModel(this.line);
            System.cmdEnd();
            return;
        }else if(idx != 0 && evt.button == 0){
            this.line = this._createLine();
            this.line.begin = pos;
        }
    },
    movePoint: function (idx, pos, evt) {
        pos = CS(this, "movePoint", idx, pos, evt);
        if (idx >= 1)this.line.end = pos;
    }
});

//# sourceURL=file://ui/cmd/addline.js