function SketcherEditorLoop(view, model) {
    CS(this, view, model);
}
CE(SketcherEditorLoop, ViewObjectBase);
Object.assign(SketcherEditorLoop.prototype, {
    create: function () {
        var context = this.view.context, tol = 0.05;
        if (!context)return;
        if (this.svgs && this.svgs.length > 0)return;

        var view = this.view;
        var model = this.model;
        console.assert(view);

        var path = this.path = context.path().attr({
            stroke: "none",
            "stroke-width": 3,
            "fill": "white",
            "fill-opacity": 0.8,
            "stroke-opacity": 0.5,
            //cursor: "move",
            did: this.id
        }).click(function (evt) {
            evt.stopPropagation();
            pickModel(model, evt.ctrlKey);
        });
        this.svgs.push(path);

        // model events:
        model.vce.add(function (sender, field, oldV, newV) {
            this.dF |= 1, this.update();
        }.bind(this));
        this.dF |= 1, this.update();

        // add to Layer:
        view.layers["PROFILES"].add(this.svgs);
    },
    update: function () {
        var f = 100, model = this.model;

        for (var i = 0; i < this.svgs.length; ++i) {
            this.svgs[i].attr({display: "none"});
        }
        if (!model || !model.isValid())return;
        var highlight = System.modelIsFlagOn(model, MODELFLAG_PICKED);

        var pathStr = utilSnapBuildAreaPolySvgPath(model);
        this.path.attr({
            display: "block",
            path: pathStr,
            "fill": (highlight ? "lightyellow" : "#d3d3d3")
        });
    }
});



//# sourceURL=file://ui/dialog/sketcher/editor2d/sketchereditor_loop.js