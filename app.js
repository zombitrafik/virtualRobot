function init(memory, config) {

    var io = new IOStream();
    var interpreter = $$(memory, io);
    var robot = new Robot(config, io);

    interpreter.executeCommand();
    var next = robot.executeCommand();

    while (next) {
        interpreter.executeCommand();
        next = robot.executeCommand();
    }

    interpreter.print();
    robot.print();

    /*    interpreter.executeCommand();
     interpreter.executeCommand();
     interpreter.executeCommand();
     interpreter.executeCommand();
     interpreter.executeCommand();
     interpreter.executeCommand();

     interpreter.print();
     robot.print();*/
}
/*

 *  exit [127, 128, 136, 137, 127, 128, 136, 153]
 *
 *  move up [127, 128, 136, 137, 4, 153]
 *  move right [127, 128, 136, 137, 5, 153]
 *  move down [127, 128, 136, 137, 6, 153]
 *  move left [127, 128, 136, 137, 7, 153]
 *
 *  pick up [127, 128, 136, 137, 3, 153]
 *  put down [127, 128, 136, 137, 2, 153]
 *
 *  get storage [127, 128, 136, 137, 1, 153]
 *
 *  is label [127, 128, 136, 137, 0, 153]

 */


init(
    [
        127, 128, 136, 137, 4, 153, // try to move up

        127, 128, 136, 137, 5, 153, // move right

        127, 128, 136, 137, 6, 153, // move down

        127, 128, 136, 137, 7, 153, // move left

        127, 128, 136, 137, 4, 153, // move up

        127, 128, 136, 137, 4, 153, // try to move up

        127, 128, 136, 137, 2, 153, // put down

        127, 128, 136, 137, 1, 153, // get storage

        127, 128, 136, 137, 5, 153, // move right

        127, 128, 136, 137, 3, 153, // pick up

        127, 128, 136, 137, 1, 153, // get storage

        127, 128, 136, 137, 5, 153, // move right

        127, 128, 136, 137, 2, 153, // put down

        127, 128, 136, 137, 6, 153, // move down

        127, 128, 136, 137, 2, 153, // put down

        127, 128, 136, 137, 127, 128, 136, 153 //exit
    ],
    {
        map: [
            [1, 1, 1, 1, 1],
            [1, 0, 2, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1]
        ],
        robot: {
            x: 1,
            y: 1,
            storage: 1,
            capacity: 10
        }
    }
);
