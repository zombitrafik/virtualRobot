function Map (mapData) {
    var map = JSON.parse(JSON.stringify(mapData));

    this.is = function (cell, type) {
        return this.get(cell) == type;
    };

    this.get = function (cell) {
        return map[cell.y][cell.x];
    };

    this.put = function (cell, type) {
        return map[cell.y][cell.x] = type;
    };

    this.inRect = function (position) {
        return position.x >= 0 &&
                position.y >= 0 &&
                position.x < map[0].length &&
                position.y < map.length;
    };

    this.toString = function () {
        return map.map(function (row) {
            return row.join(' ');
        }).join('\n');
    };

    this.print = function () {
        console.log(this.toString());
    };

    this.getMap = function () {
        return map;
    }
}


/*
 *   0 - empty cell
 *   1 - wall cell
 *   2 - label
 */

Map.typesEnum = {
    EMPTY: 0,
    WALL: 1,
    LABEL: 2
};
