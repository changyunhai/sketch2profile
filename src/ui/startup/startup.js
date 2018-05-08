function startupUI(xmls) {
    var p = Promise.resolve();
    xmls.forEach(function (dom) {
        p = p.then(function () {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: dom, type: "GET", dataType: "html"
                }).done(function (data) {
                    $("body").append($(data));
                    resolve(dom);
                });
            });
        });
    });
    return p;
}


function main() {
    startupUI([
        "ui/layout/layout.xml",
        "ui/dialog/sketcher_dialog.xml",
        "ui/dialog/sketcher_setting.xml"
    ]).then(function () {

    });
}


main();