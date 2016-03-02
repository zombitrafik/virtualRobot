function IOStream() {

    var memory = null;
    var _isSetCommand = false;

    this.isSetCommand = function () {
        return _isSetCommand;
    };

    this.setCommand = function () {
        _isSetCommand = true;
    };

    this.setMemory = function (_memory) {
        _isSetCommand = false;
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