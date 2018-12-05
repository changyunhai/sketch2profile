function Entity(opt) {
    this.id = (opt && opt.id) || uuid();
    this.oId = this.id;
    defineValue(this, "flag", 0);
    if (typeof signals != "undefined") {
        this.vce = new signals.Signal()
    }
}
Object.assign(Entity.prototype,IClonable, {
    toJSON: function () {
        var saved = {};
        saved.id = this.id;
        saved.flag = this.flag;
        saved.oId = this.oId;
        return saved;
    },copyTo:function(toEntity){
        toEntity.flag = this.flag;
    }
});