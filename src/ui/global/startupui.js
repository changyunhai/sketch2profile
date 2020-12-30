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

//# sourceURL=file://ui/global/startupui.js