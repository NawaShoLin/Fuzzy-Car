var Environment = function(walls) {
    this.walls = walls || [];

    this.addWall = function(wall) {
        this.walls.push(wall);
    };
};
