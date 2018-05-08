function Entity(opt) {
    this.id = (opt && opt.id) || uuid();
    if (typeof signals != "undefined") {
        this.vce = new signals.Signal()
    }
}