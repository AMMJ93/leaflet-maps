L.Control.ZoomBar = L.Control.extend({
    options: {position: "topleft"}, initialize: function (a) {
        L.setOptions(this, a)
    }, _isSmallScreen: function () {
        var b = window.screen.availWidth * window.screen.availHeight;
        var c = (b < 307456) ? true : false;
        return c
    }, onAdd: function (b) {
        document.ondragstart = function () {
            return false
        };
        var a = L.DomUtil.create("div", "leaflet-control-zoom leaflet-bar");
        this._map = b;
        this._zoomStartLatLng = this._map.getCenter();
        this._zoomStartZoom = this._map.getZoom();
        this._zoomInButton = this._createButton("+", "Zoom In", "leaflet-control-zoom-in", a, this._zoomIn, this);
        this._zoomOutButton = this._createButton("-", "Zoom Out", "leaflet-control-zoom-out", a, this._zoomOut, this);
        if (this._isSmallScreen() === false) {
            this._zoomToAreaButton = this._createButton("", "Zoom to Area", "leaflet-control-zoom-to-area", a, this._zoomToArea, this)
        }
        this._map.on("zoomend zoomlevelschange", this._updateDisabled, this);
        this._updateDisabled();
        return a
    }, onRemove: function (a) {
        a.off("zoomend zoomlevelschange", this._updateDisabled, this)
    }, _zoomStart: function (a) {
        this._map.setView(this._zoomStartLatLng, this._zoomStartZoom)
    }, _zoomIn: function (a) {
        this._map.zoomIn(a.shiftKey ? 3 : 1)
    }, _zoomOut: function (a) {
        this._map.zoomOut(a.shiftKey ? 3 : 1)
    }, _updateDisabled: function () {
        L.DomUtil.removeClass(this._zoomInButton, "leaflet-disabled");
        L.DomUtil.removeClass(this._zoomOutButton, "leaflet-disabled");
        if (this._map._zoom <= this._map.getMinZoom()) {
            L.DomUtil.addClass(this._zoomOutButton, "leaflet-disabled")
        }
        if (this._map._zoom >= this._map.getMaxZoom()) {
            L.DomUtil.addClass(this._zoomInButton, "leaflet-disabled")
        }
    }, _createButton: function (d, h, f, a, e, c) {
        var g = L.DomUtil.create("a", f, a);
        g.innerHTML = d;
        g.href = "#";
        g.title = h;
        var b = L.DomEvent.stopPropagation;
        L.DomEvent.on(g, "click", b).on(g, "mousedown", b).on(g, "dblclick", b).on(g, "click", L.DomEvent.preventDefault).on(g, "click", e, c);
        return g
    }
});
L.Map.mergeOptions({zoomBarControl: false});
L.Map.addInitHook(function () {
    if (this.options.zoomBarControl) {
        this.zoomBarControl = new L.Control.ZoomBar();
        this.addControl(this.zoomBarControl)
    }
});
L.control.zoomBar = function (a) {
    return new L.Control.ZoomBar(a)
};