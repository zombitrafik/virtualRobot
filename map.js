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

    this.toString = function () {
        return map.map(function (row) {
            return row.join(' ');
        }).join('\n');
    };

    this.print = function () {
        console.log(this.toString());
    };
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
