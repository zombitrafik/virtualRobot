
function init(memory, config) {



    var io = new IOStream();
    var interpreter = $$(memory, io);
    var robot = new Robot(config, io);

    function step () {
        interpreter.executeCommand();
        robot.executeCommand();
    }

    step();


/*    interpreter.executeCommand();
    interpreter.executeCommand();
    interpreter.executeCommand();
    interpreter.executeCommand();
    interpreter.executeCommand();
    interpreter.executeCommand();

    interpreter.print();
    robot.print();*/
}

init(
    [127, 128, 136, 137, 0, 153],
    {
        map: [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1]
        ],
        robot: {
            x: 1,
            y: 1,
            storage: 3,
            capacity: 10
        }
    }
);


function IOStream () {

    var memory = null;
    var _isSetCommand = false;

    this.isSetCommand = function () {
        return _isSetCommand;
    };

    this.setCommand = function () {
        _isSetCommand = true;
    };

    this.setMemory = function (_memory) {
        memory = _memory;
    };

    //get value from MEMORY[255]
    this.read = function () {
        return memory.get(255);
    };

    //write value to MEMORY[255]
    this.write = function (value) {
        memory.put(255, value);
        _isSetCommand = false;
    };
}