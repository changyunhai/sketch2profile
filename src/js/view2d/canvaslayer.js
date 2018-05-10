function View2dCanvasLayer(dom, opt) {
    CS(this, dom, opt);

    this.viewObjects = {};
}
CE(View2dCanvasLayer, View2dCanvasBase);

Object.assign(View2dCanvasLayer.prototype, {
    init: function () {
        CS(this, "init");

        var o = this.context.circle(0, 0, 10).attr({
            fill: "red"//仅仅用来测试，没有实际意义
        })
    },
    toJSON: function () {
        return Object.keys(this.viewObjects).map(function (viewObjectId) {
            var vo = this.viewObjects[viewObjectId];
            return vo.toJSON();
        }, this)
    },
    clear: function () {
        CS(this, "clear");
        this.viewObjects = {};
    },

    update: function (scene) {
    }
});

