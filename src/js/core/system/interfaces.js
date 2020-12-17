var IClonable = {
    clone: function (callback) {
        var cloned = new (this.constructor)();
        this.copyTo(cloned);
        if (callback)callback(this, cloned);
        return cloned;
    },
    copyTo: function (toEntity) {
        throw new Error("Implement interface: copyTo");
    }
}

 