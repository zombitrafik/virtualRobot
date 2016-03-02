function Debugger (robot) {
    this.robot = robot;

    var self = this;

    this.update = function () {
        this.drawDebugInfo();
    };

    var templates = {
        REGISTER: (function (index, value) {
            return '<div><span>R' + index + '</span> - ' + value + '</div>';
        }),
        MEMORY: (function (index, info, cell) {
            if(index == info.pointer) {
                return '<div class="active"><span>></span>|<span>' + self.getLeftPadding(index, 3) + '</span>| ' + '<span>' + self.getRightPadding(cell, 3) + ' [' + info.command.type.replace('RI','R' + info.command.i).replace('RJ',' R' + info.command.j) + ']</span></div>';
            } else {
                return '<div>&nbsp;|<span>' + self.getLeftPadding(index, 3) + '</span>| ' + '<span>' + self.getRightPadding(cell, 3) + ' </span></div>';
            }
        }),
        FIELD: (function (classes, i, j) {
            return '<div class="' + classes.join(' ') + '" data-x="' + j + '" data-y="' + i + '"></div>';
        }),
        BREAKER: (function () {
            return '<div style="clear: both;"></div>';
        })
    };

    this.drawDebugInfo = function () {
        var info = robot.getDebugger();

        var registers = document.getElementsByClassName('registers')[0];
        registers.innerHTML = info.registers.getRegisters().map(function (register, i) {
            return templates.REGISTER(i, register);
        }).join('\n');

        var memory = document.getElementsByClassName('memory')[0],
            memoryChunk = this.getMemoryChunk(info.memory, info.pointer, 10),
            memoryData = [];
        for(var i = memoryChunk.start; i < memoryChunk.end; i++) {
            var cell = memoryChunk.data[i];
            memoryData.push(templates.MEMORY(i, info, cell));
        }

        memory.innerHTML = memoryData.join('\n');

        this.drawMap();
    };

    this.drawMap = function () {
        var Debugger = robot.getDebugger();

        var field = document.getElementsByClassName('field')[0];

        var map = Debugger.map,
            robotPos = Debugger.robot;

        var fieldHTML = [];

        for(var i = 0; i < map.length; i++) {
            for(var j = 0; j < map[i].length; j++) {
                var classes = [];
                if(i == robotPos.y && j == robotPos.x) {
                    classes.push('robot');
                }
                switch (map[i][j]) {
                    case 0:
                        classes.length == 0 && classes.push('wall');
                        break;
                    case 1:
                        classes.length == 0 && classes.push('empty');
                        break;
                    case 2:
                        classes.push('label');
                        break;
                    default:
                        break;

                }
                fieldHTML += templates.FIELD(classes, i, j);
            }
            fieldHTML += templates.BREAKER();
        }

        field.innerHTML = fieldHTML;
    };

    this.getMemoryChunk = function (data, middle, count) {
        var start = middle <= count ? 0 : middle + count<data.length?middle - count:data.length - count*2,
            end = middle + count<data.length?start + count * 2:data.length;
        var chunk = [];
        for (var i = start; i < end; i++) {
            chunk[i] = data[i];
        }
        return {
            data: chunk,
            start: start,
            end: end
        }
    };

    this.getLeftPadding = function (i, max) {
        return this.getPadding(i, max, '&nbsp;') + i;
    };

    this.getRightPadding = function (i, max) {
        return i + this.getPadding(i, max, '&nbsp;');
    };

    this.getPadding = function (i, max, value) {
        return Array.apply(null, new Array(max - i.toString().length)).map(function () {
            return value;
        }).join('');
    };

    this.update();
}