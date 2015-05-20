var Painter = (function () {
    'use strict';

    /** @constructor */
    var Painter = function(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.lines = [];
        this.circles = [];
        this.messages = [];

        this.defaultLineWidth = 1;
        this.defaultStrokeStyle = "black";
    };


    Painter.prototype.addLine = function(line) {
        this.lines.push(line);
    };

    Painter.prototype.addCircle = function(circle) {
        this.circles.push(circle);
    };

    Painter.prototype.addMessage = function(msg) {
        this.messages.push(msg);
    };

    Painter.prototype.draw = function() {
        var clearCanvas = function (self) {
            var canvas = self.canvas;
            self.context.clearRect(0, 0, canvas.width, canvas.height);
        };

        clearCanvas(this);

        this._drawLines();
        this.lines = [];

        this._drawCircles();
        this.circles = [];

        this._drawMessages();
    };


    Painter.prototype._drawLine = function(p1, p2, lineWidth, strokeStyle) {
        var ctx = this.context;

        ctx.save();
        ctx.beginPath();

        ctx.lineWidth = lineWidth || this.defaultLineWidth;
        ctx.strokeStyle = strokeStyle || this.defaultStrokeStyle;

        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        ctx.stroke();
        ctx.restore();
    };


    Painter.prototype._drawLines = function() {
        var lines = this.lines;

        for (var i = 0; i < lines.length; i += 1) {
            var line = lines[i];
            this._drawLine(line.p1, line.p2, line.width, line.color);
        }
    };

    Painter.prototype._drawCircle = function(center, radius, lineWidth, strokeStyle) {
        var ctx  = this.context;
        ctx.save();
        ctx.beginPath();

        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = lineWidth || this.defaultLineWidth;
        ctx.strokeStyle = strokeStyle || this.defaultStrokeStyle;

        ctx.stroke();
        ctx.restore();
    };

    Painter.prototype._drawCircles = function() {
        var circles = this.circles;

        for (var i = 0; i < circles.length; i += 1) {
            var c = circles[i];
            this._drawCircle(c.center, c.radius, c.lineWidth, c.strokeStyle);
        }
    };

    Painter.prototype._drawMessages = function() {
        var fontSize = 25;
        for (var i = 0; i < this.messages.length; i += 1) {
            var ctx  = this.context;
            ctx.save();
            ctx.font = "" + fontSize + "px Arial";
            ctx.fillText(this.messages[i], 20, (fontSize + 4) * (i + 1));
            ctx.restore();
        }
        this.messages = [];
    };

    Painter.prototype.Height = function() {
        return this.canvas.height;
    };

    Painter.prototype.Width = function() {
        return this.canvas.width;
    };


    return Painter;
})();
