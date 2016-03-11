var robot, debug, interpreter;
var program, config;
var configurer;

function init() {

    interpreter = $$(program);
    robot = new Robot(config, interpreter);
    debug = new Debugger(robot);

}

function reset () {
    var prg = $$(program);
    robot = new Robot(config, prg);
    debug = new Debugger(robot);
    document.getElementsByClassName('run')[0].style.display = 'inline-block';
    document.getElementsByClassName('step-by-step')[0].style.display = 'inline-block';
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
    document.getElementsByClassName('run')[0].style.display = 'none';
    document.getElementsByClassName('step-by-step')[0].style.display = 'none';
    interpreter.print();
    robot.print();
}

function newProgram () {
    location.reload();
}

function isValidProgram () {

}

function goToStep (step) {
    var activeTab = document.getElementsByClassName('header-' + (step - 1))[0];
    activeTab.className = activeTab.className.replace('active', '');

    var stepTab = document.getElementsByClassName('header-' + step)[0];
    stepTab.className += ' active';

    var activeFrame = document.getElementsByClassName('frame-' + (step - 1))[0];
    activeFrame.className += activeFrame.className.replace('active', '');


    var stepFrame = document.getElementsByClassName('frame-' + step)[0];
    stepFrame.className += ' active';

    if(step == 2) {
        initConfigurer();
    }

    if(step == 3) {
        program = document.getElementById('source-code').value.split('\n').filter(function (v) {
            return isFinite(v) && parseInt(v) <= 255;
        }).map(function (v) {
            return parseInt(v);
        });
        config = configurer.getConfig();
        init();
    }
}

function initConfigurer () {
    var configField = document.getElementsByClassName('config-field')[0];
    var map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    configurer = new Configurer(map, configField)
}

function changeCell (i, j) {
    configurer.changeCell(i, j);
}

function setRobotPos (i, j) {
    configurer.setRobotPos(i, j);
}

function Configurer (map, element) {
    this.map = map;
    this.element = element;
    this.robotPos = {x: 1, y: 1};
    this.capacity = 10;
    this.storage = 3;

    var self = this;

    var templates = {
        FIELD: (function (classes, i, j) {
            return '<div class="' + classes.join(' ') + '" data-x="' + j + '" data-y="' + i + '" onclick="changeCell('+i+','+j+')" oncontextmenu="setRobotPos('+i+','+j+');return false;"></div>';
        }),
        BREAKER: (function () {
            return '<div style="clear: both;"></div>';
        })
    };

    this.changeCell = function (i, j) {
        var value = this.map[i][j];
        value++;
        if(value > 2) {
            value = 0;
        }
        if(this.robotPos.x == j && this.robotPos.y == i && value == 1) {
            return;
        }
        this.map[i][j] = value;
        this.update();
    };

    this.setRobotPos = function (i, j) {
        if(this.map[i][j] != 1) {
            this.robotPos = {x: j, y: i};
            this.update();
        }
    };

    this.update = function () {
        this.draw();
    };

    this.draw = function () {
        var fieldHTML = '';
        for(var i = 0; i < map.length; i++) {
            for(var j = 0; j < map[i].length; j++) {
                var classes = [];
                if(i == this.robotPos.y && j == this.robotPos.x) {
                    classes.push('robot');
                }
                switch (map[i][j]) {
                    case 0:
                        classes.length == 0 && classes.push('empty');
                        break;
                    case 1:
                        classes.length == 0 && classes.push('wall');
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
        this.element.innerHTML = fieldHTML;
    };

    this.getConfig = function () {
        return {
            map: this.map,
            robot: {
                x: this.robotPos.x,
                y: this.robotPos.y,
                storage: parseInt(document.getElementById('robot-storage').value),
                capacity: parseInt(document.getElementById('robot-capacity').value)
            }

        }
    };

    this.update();
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

