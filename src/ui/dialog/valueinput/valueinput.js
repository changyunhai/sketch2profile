startupUI(["ui/dialog/valueinput/valueinput.xml"])
    .then(function () {

    });


function PopupValueInputDialogPromise(title, labelText, defaultValue) {
    return new Promise(function (resolve, reject) {
        function OKClick() {
            layer.close(index);
            var val = dialog.find(".ValueText").val();
            resolve(val);
        }

        var dialog = $('.ValueInputPopup');
        dialog.find(".labelText").text(labelText || "请输入：");
        dialog.find(".ValueText").val(defaultValue || "");

        var index = layer.open({
            type: 1,
            title: title,
            moveType: 1,
            moveOut: true,
            skin: 'layui-layer-default',
            fix: false,
            closeBtn: 1,
            shadeClose: true,
            shade: 0,
            maxmin: false,
            area: ['400px', '180px'],
            content: dialog,
            success: function () {
                dialog.find('.OKButton').bind(click, OKClick);
            },
            end: function () {
                dialog.find('.OKButton').unbind(click, OKClick);
                dialog.hide();
            }
        });
    });
}

