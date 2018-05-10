function Entity(opt) {
    this.id = (opt && opt.id) || uuid();
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
        return saved;
    },copyTo:function(toEntity){
        toEntity.flag = this.flag;
    }
});