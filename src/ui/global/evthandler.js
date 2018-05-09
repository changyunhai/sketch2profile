
pickedChangedEvt.add(function (picked, op, model) {
    if (model && op == "add")System.modelSetFlagOn(model, MODELFLAG_PICKED);
    else if (model && op == "remove")System.modelSetFlagOff(model, MODELFLAG_PICKED);
});


