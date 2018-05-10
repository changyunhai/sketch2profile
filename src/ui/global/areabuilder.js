function buildArea() {
    var curves = sceneAllModels().filter(function (entity) {
        return entity instanceof Curve;
    });
    var init = sketch2profile.INIT(curves);
    var be = sketch2profile.BE();
    var profiles = sketch2profile.BL();
    var loops = profiles.LO;
}