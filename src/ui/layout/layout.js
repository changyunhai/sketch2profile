startupUI([
        "ui/layout/layout.xml"
    ]).then(function () {
    // area okbutton
	$(".area_change_box .ok_button").on("click",function(){
		var curves =  [{x:-2,y:1.5},{x:2,y:1.5},{x:2,y:-1.5},{x:-2,y:-1.5},{x:-2,y:1.5}];
		if($(".area_change_box .area_change input:checked").attr("id") == "user_defined_area"){
			curves = $(".area_change_box .user_defined_area").text().trim();
		}
		popUpSketcherDialogPromise(curves);
	});
});