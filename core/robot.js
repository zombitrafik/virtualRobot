var Robot = function (config, interpreter) {

    this.io = new IOStream();

    interpreter.setIOStream(this.io);
    this.interpreter = interpreter;

    var map = new Map(config.map);
    var storage = config.robot.storage;
    var capacity = config.robot.capacity;
    var position = new Vector2(config.robot.x, config.robot.y);

    var moveEnum = {
        LEFT: new Vector2(-1, 0),
        RIGHT: new Vector2(1, 0),
        UP: new Vector2(0, -1),
        DOWN: new Vector2(0, 1)
    };

    var self = this;

    var commands = {
        '0': function () {
            console.log('CHECK IS LABEL', map.is(position, Map.typesEnum.LABEL));
            return map.is(position, Map.typesEnum.LABEL)?255:0;
        },
        '1': function () {
            console.log('GET STORAGE', storage);
            return storage;
        },
        '2': function () {
            if(!map.is(position, Map.typesEnum.LABEL) && storage > 0) {
                map.put(position, Map.typesEnum.LABEL);
                console.log('PUT LABEL');
                storage--;
                return 255;
            } else {
                return 0;
            }
        },
        '3': function () {
            if(map.is(position, Map.typesEnum.LABEL) && storage < capacity) {
                map.put(position, Map.typesEnum.EMPTY);
                console.log('PICK UP');
                storage++;
                return 255;
            } else {
                return 0;
            }
        },
        '4': function () {
            return self.move(moveEnum.UP)?255:0;
        },
        '5': function () {
            return self.move(moveEnum.RIGHT)?255:0;
        },
        '6': function () {
            return self.move(moveEnum.DOWN)?255:0;
        },
        '7': function () {
            return self.move(moveEnum.LEFT)?255:0;
        }
    };

    this.move = function (side) {
        var nextPosition = position.add(side);
        if(!map.is(nextPosition, Map.typesEnum.WALL)) {
            position = nextPosition;
            console.log('MOVE ', side);
            return true;
        } else {
            console.log('CANT MOVE ', side);
            return false;
        }
    };

    this.run = function () {
        while(this.executeCommand()) {}
    };

    this.executeCommand = function () {
        this.interpreter.executeCommand();
        var command = this.io.read();
        if(this.io.isSetCommand()) {
            if(command == 255) {
                console.log('EXIT');
                return false;
            } else {
                this.io.write(commands[command]());
                return true;
            }
        }
        return true;
    };


    this.print = function () {
        map.print();
    };

    this.getDebugger = function () {
        return {
            pointer: interpreter.pointer,
            registers: interpreter.getRegisters(),
            memory: interpreter.getMemory(),
            map: map
        }
    };
};

function Vector2 (x, y) {
    this.x = x;
    this.y = y;
    this.add = function (vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    };
}