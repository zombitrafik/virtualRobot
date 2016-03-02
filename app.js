var robot, debug, interpreter;
var program, config;

function init() {

    interpreter = $$(program);
    robot = new Robot(config, interpreter);
    debug = new Debugger(robot);

}

function reset () {
    var prg = $$(program);
    robot = new Robot(config, prg);
    debug = new Debugger(robot);
}

function run() {
    robot.run();
    debug.update();
    enableRefresh();
}

function step() {
    if(!robot.executeCommand()) {
        enableRefresh();
    }
    debug.update();
}

function enableRefresh() {
    interpreter.print();
    robot.print();
}

function goToStepTwo () {
    var activeTab = document.getElementsByClassName('header-one')[0];
    activeTab.className = activeTab.className.replace('active', '');

    var stepTab = document.getElementsByClassName('header-two')[0];
    stepTab.className += ' active';
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

program = [
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
];

config = {
    map: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 2, 0, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 0, 2, 0, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1]
    ],
    robot: {
        x: 1,
        y: 1,
        storage: 1,
        capacity: 10
    }
};

init();
