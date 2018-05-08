function ViewObjectBase(view, model) {
    this.view = view;
    this.model = model;
    this.id = model && model.id;
    this.svgs = [];
}

Object.assign(ViewObjectBase.prototype, {
    toJSON: function () {
        return this.model;
    },
    update: function () {
    }
});

