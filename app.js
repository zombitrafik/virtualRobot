var robot, program, Debugger;

function init(memory, config) {

    program = $$(memory);
    robot = new Robot(config, program);

    Debugger = robot.getDebugger();

    drawDebugInfo();
}

function run () {
    robot.run(); // form start to end
    //robot.executeCommand(); // line-by-line

    program.print();
    robot.print();
    drawDebugInfo()
}

function step () {
    robot.executeCommand(); // line-by-line

    program.print();
    robot.print();
    drawDebugInfo();
}


function drawDebugInfo () {
    var Debugger = robot.getDebugger();

    var registers = document.getElementsByClassName('registers')[0];
    registers.innerHTML = Debugger.registers.getRegisters().map(function (register, i) {
        return '<div>R' + i + ' - ' + register + '</div>';
    }).join('\n');
    var memory = document.getElementsByClassName('memory')[0];
    memory.innerHTML = Debugger.memory.getMemory().map(function (cell, i) {
        return '<div ' + (i==Debugger.pointer?getClass('active'):'') + ' >' + (i==Debugger.pointer?'<span>></span>':' ') + '|' + getLeftPadding(i, 3) + '| ' + '<span>' + cell + '</span></div>';
    }).join('\n');

}

function getClass (className) {
    return ' class="' + className + '"';
}

function getLeftPadding(i, max) {
    return Array.apply(null, new Array(max - i.toString().length)).map(function () {return ' ';}).join('') + i;
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
