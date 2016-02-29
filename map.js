function Map (mapData) {
    var map = mapData;

    this.is = function (cell, type) {
        return this.get(cell) == type;
    };

    this.get = function (cell) {
        return map[cell.y][cell.x];
    };

    this.put = function (cell, type) {
        return map[cell.y][cell.x] = type;
    };
}


/*
 *   0 - empty cell
 *   1 - wall cell
 *   2 - robot
 *   3 - label
 */

Map.typesEnum = {
    EMPTY: 0,
    WALL: 1,
    ROBOT: 2,
    LABEL: 3
};
