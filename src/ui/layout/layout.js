startupUI([
    "ui/layout/layout.xml"
]).then(function () {

    // area okbutton
    $(".area_change_box .ok_button").on(click, function () {
        var design = getParameterByName("design");
        if (design) {
            var url = "../designs/" + design + ".json"; // todo, use real url...
            return $.ajax({
                url: url,
                dataType: "json",
                success: function (data) {
                    utilLoadDocumentStr(JSON.stringify(data));
                    return popUpSketcherDialogPromise();
                }
            });
        }


        var curves = [];
        var checkedRadioId = $(".area_change_box form input:checked").attr("id");
        if (checkedRadioId == "user_defined_area") {
            var str = $(".area_change_box .user_defined_area").val();
            curves = JSON.parse(str);
        } else if (checkedRadioId == "default_rect") {
            curves = [{x: -2, y: 1.5}, {x: 2, y: 1.5}, {x: 2, y: -1.5}, {x: -2, y: -1.5}, {x: -2, y: 1.5}];
        }
        popUpSketcherDialogPromise(curves);
    });
});