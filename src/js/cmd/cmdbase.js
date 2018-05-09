function CmdBase() {
}

Object.assign(CmdBase.prototype, {
    /*---------  executable:  ------------*/
    begin: function () {
    },
    end: function () {
    },
    exe: function (type, evt, arg0, arg1, arg2, arg3) {
        console.log("cmd type=" + type);

        if (type.indexOf("mousemove") != -1)this.onMouseMove(evt, arg0, arg1, arg2, arg3);
        else if (type.indexOf("mousedown") != -1)this.onMouseDown(evt, arg0, arg1, arg2, arg3);
        else if (type.indexOf("mouseup") != -1)this.onMouseUp(evt, arg0, arg1, arg2, arg3);
        else if (type.indexOf("keypress") != -1)this.onKeyPress(evt, arg0, arg1, arg2, arg3);
    },
    /*------derived------*/
    onMouseMove: function () {
    },
    onMouseDown: function () {
    },
    onMouseUp: function () {
    },
    onKeyPress: function () {
    }
});


(function () {
    var _cmdCurrent = undefined;
    Object.assign(System, {
        cmdBegin: function (cmd) {
            cmd.begin();
            _cmdCurrent = cmd;
        }, cmdEnd: function () {
            _cmdCurrent.end();
            _cmdCurrent = undefined;
        }, cmdCurrent: function () {
            return _cmdCurrent;
        }
    });
})();
