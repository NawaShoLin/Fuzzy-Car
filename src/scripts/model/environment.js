var Environment = function(walls, endY) {
    this.walls = walls || [];
    this.endY = endY;

    this.addWall = function(wall) {
        this.walls.push(wall);
    };
};
