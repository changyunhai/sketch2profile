startupUI([
    "ui/layout/layout.xml"
]).then(function () {
    // area okbutton
    $(".area_change_box .ok_button").on(click, function () {
        var curves = [];
        var checkedRadioId = $(".area_change_box from input:checked").attr("id");
        if (checkedRadioId == "user_defined_area") {
            var str = $(".area_change_box .user_defined_area").text().trim();
            curves = eval(str);
        } else if (checkedRadioId == "default_rect") {
            curves = [{x: -2, y: 1.5}, {x: 2, y: 1.5}, {x: 2, y: -1.5}, {x: -2, y: -1.5}, {x: -2, y: 1.5}];
        }
        popUpSketcherDialogPromise(curves);
    });
});