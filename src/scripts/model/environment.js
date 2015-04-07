var Environment = function(lines) {
    this.lines = lines || [];

    this.addLine = function(line) {
        lines.push(line);
    };
};