function View2dCanvasBase(dom, opt) {
    this.dom = dom;
    this.opt = opt;

    this.viewport = undefined;
    this.initViewport = undefined;
    this.context = undefined;

    this.layers = {};
    this.layersOrder = [];
}
Object.assign(View2dCanvasBase.prototype, {
    init: function () {
        console.assert(this.dom);
        this.context = Snap(this.dom);

        this.layersOrder.forEach(function (layerName) {
            this.createLayer(layerName);
        }, this);
        view2dCanvasBindMouseEvent(this);

        this.fit();
    },
    createLayer: function (layerName) {
        var view2d = this;
        var paper = view2d.context;
        var g = view2d.layers[layerName] || paper.g();
        g.attr("type", layerName);
        view2d.layers[layerName] = g;
    },
    clearLayer: function (layerName) {
        var view2d = this;
        var layer = view2d.layers[layerName];
        layer.children().forEach(function (element) {
            element.remove();
        })
    },
    clear: function () {
        this.layersOrder.forEach(function (layerName) {
            this.clearLayer(layerName);
        }, this);
    },
    fit: function (userBound) {
        if (!this.context)return;
        var clientRect = this.dom && this.dom.getBoundingClientRect && this.dom.getBoundingClientRect();
        var domClientRectBound = new Bound(-clientRect.left + clientRect.width / 2, clientRect.top - clientRect.height / 2, clientRect.width, clientRect.height);
        this.viewport = domClientRectBound;
        this.context.attr("viewBox", this.viewport.left + "," + this.viewport.top + "," + this.viewport.width + "," + this.viewport.height);

        var fitBound = userBound;
        if (!fitBound || !fitBound.isValid())return;

        var fitCenter = fitBound.center();
        var actualWidth = fitBound.width, actualHeight = fitBound.height;

        var v = this.viewport;
        if (v.width / v.height > actualWidth / actualHeight) {// viewport is fat:
            actualWidth = v.width / v.height * actualHeight;
        } else {// viewport is thin and narrow:
            actualHeight = v.height / v.width * actualWidth;
        }

        v.left = fitCenter.x - actualWidth / 2;
        v.top = -fitCenter.y - actualHeight / 2;
        v.width = actualWidth;
        v.height = actualHeight;
        this.context.attr("viewBox", this.viewport.left + "," + this.viewport.top + "," + this.viewport.width + "," + this.viewport.height);
        this.initViewport = this.viewport.clone();
    },
    zoom: function (delta, mousePt) {
        var factor = (delta > 0 ? 0.9 : 1.11);
        var origPt = this.PM2S(0, 0);
        var mousePtX = ( mousePt && mousePt.x ) || origPt.x;
        var mousePtY = ( mousePt && mousePt.y ) || origPt.y;

        var ptOldModelPt = this.PS2M(mousePtX, mousePtY);

        this.viewport.width *= factor;
        this.viewport.height *= factor;
        var ptNewModelPt = this.PS2M(mousePtX, mousePtY);

        this.viewport.left += 100 * (ptOldModelPt.x - ptNewModelPt.x);
        this.viewport.top += -100 * (ptOldModelPt.y - ptNewModelPt.y);
        this.context.attr("viewBox", this.viewport.left + "," + this.viewport.top + "," + this.viewport.width + "," + this.viewport.height);

    },
    pan: function (delta) {
        var mPosOffset = this.VS2M(delta.x, delta.y);
        this.viewport.left -= 100 * (mPosOffset.x);
        this.viewport.top += 100 * (mPosOffset.y);
        this.context.attr("viewBox", this.viewport.left + "," + this.viewport.top + "," + this.viewport.width + "," + this.viewport.height);

    },
    PS2M: function (screen_x, screen_y) {
        var view = this;
        var viewElementBound = view.dom.getBoundingClientRect();
        var viewportBound = view.viewport;

        var scale_x = viewportBound.width / viewElementBound.width;
        var scale_y = viewportBound.height / viewElementBound.height;
        var x = (screen_x - viewElementBound.left) * scale_x + viewportBound.left;
        var y = (screen_y - viewElementBound.top) * scale_y + viewportBound.top;

        return {x: x / 100, y: -y / 100};
    },
    VS2M: function (screen_offset_x, screen_offset_y) {
        var view = this;
        var mPos = this.PS2M(screen_offset_x, screen_offset_y);
        var mZeroPos = this.PS2M(0, 0);
        return {x: (mPos.x - mZeroPos.x), y: (mPos.y - mZeroPos.y)};
    },
    PM2S: function (model_x, model_y) {
        var view = this;
        var screen_x = model_x * 100, screen_y = -model_y * 100;

        var viewElementBound = view.dom.getBoundingClientRect();
        var viewportBound = view.viewport;

        var scale_x = viewportBound.width / viewElementBound.width;
        var scale_y = viewportBound.height / viewElementBound.height;
        var x = (screen_x - viewportBound.left) / scale_x;
        var y = (screen_y - viewportBound.top) / scale_y;

        return {x: x + viewElementBound.left, y: y + viewElementBound.top};
    }
});

function view2dCanvasBindMouseEvent(view) {
// mouse event:
    var svg = view.context.defs.ownerSVGElement;

    function onMouseWheel(e) {
        var delta = e.wheelDelta ? (e.wheelDelta / 120) : (-e.detail / 3);
        var mouseX = e.pageX, mouseY = e.pageY;
        this.zoom(delta, {x: mouseX, y: mouseY});
    }

    function onMouseEvent(evt) {
        //__log('svg canvas mouse ' + evt.type);
        if ((evt.buttons & 4) != 0) { // this is mouse wheel , pan the viewport.
            this.pan({x: evt.movementX, y: evt.movementY});
            return;
        }
        //todo
    }

    var mouseEvt = onMouseEvent.bind(view);

    svg.addEventListener('mousewheel', onMouseWheel.bind(view));
    svg.addEventListener('DOMMouseScroll', onMouseWheel.bind(view));

    svg.addEventListener('mousedown', mouseEvt);
    svg.addEventListener('mousemove', mouseEvt);
    svg.addEventListener('mouseup', mouseEvt);
    svg.addEventListener('touchmove', mouseEvt);
}