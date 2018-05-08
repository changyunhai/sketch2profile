function View2dCanvasLayer(dom, opt) {
    CS(this, dom, opt);

    this.viewObjects = {};
}
CE(View2dCanvasLayer, View2dCanvasBase);

Object.assign(View2dCanvasLayer.prototype, {
    init: function () {
        this.layersOrder = ["ROOM", "AREA"];
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
        scene.filter(function (e) {
            return e.type == "ROOM";
        }).forEach(function (roomModel) {
            if (!this.viewObjects[roomModel.id]) {
                var r = this.viewObjects[roomModel.id] = new ViewObjectRoom(this, roomModel);
                r.update();
                this.layers["ROOM"].add(r.svgs);
            }
        }, this)


    },
    fit: function () {
        var sceneBound = undefined;//todo..
        CS(this, "fit", sceneBound);
    }
});

