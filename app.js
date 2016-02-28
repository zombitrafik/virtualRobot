
function init(memory, map) {

    var interpreter = $$(memory, Robot(map));

    interpreter.executeCommand();

}

init(
    [0, 10, 36, 127, 128, 202, 201],
    [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
    ]
);
