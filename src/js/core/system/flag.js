(function () {
    function utilIsFlagOn(flag, mask) {
        return (flag & mask) != 0;
    }

    function utilIsFlagOff(flag, mask) {
        return (flag & mask) == 0;
    }

    function utilSetFlagOn(flag, mask) {
        return flag | mask;
    }

    function utilSetFlagOff(flag, mask) {
        return flag & ~mask;
    }

    function modelIsFlagOn(m, mask) {
        return utilIsFlagOn(m.flag, mask);
    }

    function modelIsFlagOff(m, mask) {
        return utilIsFlagOff(m.flag, mask);
    }

    function modelSetFlagOn(m, mask) {
        if (modelIsFlagOff(m, mask)) {
            m.flag = m.flag | mask;
        }
    }

    function modelSetFlagOff(m, mask) {
        if (modelIsFlagOn(m, mask)) {
            m.flag = m.flag & ~mask;
        }
    }

    function modelChangeFlag(model, mask) {
        if (modelIsFlagOn(model, mask)) {
            modelSetFlagOff(model, mask);
        } else {
            modelSetFlagOn(model, mask);
        }
    }

    Object.assign(System, {
        modelIsFlagOn: modelIsFlagOn,
        modelIsFlagOff: modelIsFlagOff,
        modelSetFlagOff: modelSetFlagOff,
        modelSetFlagOn: modelSetFlagOn,
        modelChangeFlag: modelChangeFlag
    });
})();

 