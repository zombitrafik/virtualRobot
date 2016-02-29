
function init(memory, map) {

    var robot = new Robot(map);
    var interpreter = $$(memory, robot);

    interpreter.executeCommand();
    interpreter.executeCommand();
    interpreter.executeCommand();
    interpreter.executeCommand();
    interpreter.executeCommand();
    interpreter.executeCommand();

    interpreter.print();
    robot.print();
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
