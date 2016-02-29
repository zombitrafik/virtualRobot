var $$ = (function (memory, io) {

    /*

     PUSH                   i (i=0,…,127) – помещает в регистр 0 значение i.
     X2                     128 – увеличивает значение в регистре r0 в два раза.
     SET_R0$RI              128+i (i=1,…,7) – помещает в регистр r0 значение из регистра ri
     INC                    136 – увеличивает значение в регистре r0 на 1.
     SET_RI$R0              136+i (i=1,…,7) – помещает в регистр ri значение из регистра r0.
     SET_R0$MEM_RI          144+i (i=0,…,7) – помещает в регистр r0 значение из ЗУ по адресу, хранящемуся в регистре ri.
     SET_MEM_RI$R0          152+i (i=0,…,7) – помещает в ЗУ по адресу, хранящемуся в регистре ri, значение из регистра r0.
     LOGIC_1                160+i (i=0,…,7) r0=(r0+ri)%256.
     LOGIC_2                168+i (i=0,…,7) r0=(r0-ri+256)%256.
     LOGIC_3                176+i (i=0,…,7) r0=(r0*ri)%256.
     LOGIC_4                184+i (i=0,…,7) r0=(r0/ri)%256.
     MOVE_R0_RI_LESS_RJ     192+i*8+j (i=1,…,7; j=1,…,7; i?j)  – переходит по адресу в регистре r0, если ri<rj (как беззнаковые числа)
     DEC                    192 – уменьшает значение в регистре r0 на 1.
     MOVE_RI                192+i*8+i (i=1,…,7) – переходит по адресу в регистре ri.
     SWAP_R0$RI             192+i (i=1,…,7) – меняет местами значения в регистрах r0 и ri
     SWAP_R0$MEM_RI         192+i*8 (i=1,…,7) – меняет местами значения в регистре r0 ячейки, адрес которой хранится в регистре ri.

     */

    var commandENUM = {
        PUSH: 'PUSH',
        X2: 'X2',
        SET_R0$RI: 'SET_R0$RI',
        INC: 'INC',
        SET_RI$R0: 'SET_RI$R0',
        SET_R0$MEM_RI: 'SET_R0$MEM_RI',
        SET_MEM_RI$R0: 'SET_MEM_RI$R0',
        LOGIC_1: 'LOGIC_1',
        LOGIC_2: 'LOGIC_2',
        LOGIC_3: 'LOGIC_3',
        LOGIC_4: 'LOGIC_4',
        MOVE_R0_RI_LESS_RJ: 'MOVE_R0_RI_LESS_RJ',
        DEC: 'DEC',
        MOVE_RI: 'MOVE_RI',
        SWAP_R0$RI: 'SWAP_R0$RI',
        SWAP_R0$MEM_RI: 'SWAP_R0$MEM_RI'
    };

    function initArray(size, value) {
        return Array.apply(null, (new Array(size))).map(function () {
            return value || 0;
        });
    }

    function Memory(_program) {
        var program = initArray(255);
        for (var i = 0; i < _program.length; i++) {
            program[i] = _program[i];
        }
        this.length = _program.length;
        this.get = function (addr) {
            return program[addr];
        };
        this.put = function (addr, value) {
            program[addr] = value;
        };
        this.print = function () {
            console.log(program);
        };
    }

    function Registers(size) {
        var registers = initArray(size);
        this.get = function (register) {
            return registers[register];
        };
        this.put = function (register, value) {
            registers[register] = value;
        };
        this.toString = function () {
            return registers.map(function (register, i) {
                return 'R' + i + ' - ' + register;
            }).join('\n');
        };
        this.print = function () {
            console.log(this.toString());
        };
    }

    function Interpreter(memory, registers, io) {
        this.pattern = new Pattern();
        this.pointer = 0;
        this.commands = {};

        io.setMemory(memory);

        var self = this;

        this.commands[commandENUM.PUSH] = function (i) {
            registers.put(0, i);
        };
        this.commands[commandENUM.X2] = function () {
            registers.put(0, registers.get(0) * 2);
        };
        this.commands[commandENUM.SET_R0$RI] = function (i) {
            registers.put(0, registers.get(i));
        };
        this.commands[commandENUM.INC] = function () {
            registers.put(0, registers.get(0) + 1);
        };
        this.commands[commandENUM.SET_RI$R0] = function (i) {
            registers.put(i, registers.get(0));
        };
        this.commands[commandENUM.SET_R0$MEM_RI] = function (i) {
            registers.put(0, memory.get(registers.get(i)));
        };
        this.commands[commandENUM.SET_MEM_RI$R0] = function (i) {
            memory.put(registers.get(i), registers.get(0));
            //work with io
            if(registers.get(i) == 255) {
                self.streamFlush();
            }
        };
        this.commands[commandENUM.LOGIC_1] = function (i) {
            registers.put(0, (registers.get(0) + registers.get(i) % 256));
        };
        this.commands[commandENUM.LOGIC_2] = function (i) {
            registers.put(0, (registers.get(0) - registers.get(i) + 256) % 256);
        };
        this.commands[commandENUM.LOGIC_3] = function (i) {
            registers.put(0, (registers.get(0) * registers.get(i)) % 256);
        };
        this.commands[commandENUM.LOGIC_4] = function (i) {
            registers.put(0, Math.floor(registers.get(0) / registers.get(i)) % 256);
        };
        this.commands[commandENUM.MOVE_R0_RI_LESS_RJ] = function (i, j) {
            if (registers.get(i) < registers.get(j)) {
                self.pointer = registers.get(0);
            }
        };
        this.commands[commandENUM.DEC] = function () {
            registers.put(0, registers.get(0) - 1);
        };
        this.commands[commandENUM.MOVE_RI] = function (i) {
            self.pointer = registers.get(i);
        };
        this.commands[commandENUM.SWAP_R0$RI] = function (i) {
            var temp = registers.get(0);
            registers.put(0, registers.get(i));
            registers.put(i, temp);
        };
        this.commands[commandENUM.SWAP_R0$MEM_RI] = function (i) {
            var temp = registers.get(0);
            registers.put(0, memory.get(registers.get(i)));
            memory.put(registers.get(i), temp);
            //work with io
            if(registers.get(i) == 255) {
                self.streamFlush();
            }
        };

        this.executeCommand = function () {
            var command = Command(memory.get(this.pointer), this.pattern);
            this.pointer++;
            this.commands[command.type](command.i, command.j);
        };

        this.streamFlush = function () {
            io.setCommand();
        };

        this.print = function () {
            memory.print();
            registers.print();
        }
    }

    function Command(value, pattern) {
        for (var i = 0; i < pattern.length; i++) {
            if (pattern[i].equal(value)) {
                return pattern[i].getModel(value);
            }
        }
        throw new Error({message: 'Unknown command'});
    }

    function Pattern() {
        return [
            new PatternModel(
                commandENUM.PUSH,
                0,
                {from: 0, to: 127, mul: 1}
            ),
            new PatternModel(
                commandENUM.X2,
                128
            ),
            new PatternModel(
                commandENUM.SET_R0$RI,
                128,
                {from: 1, to: 7}
            ),
            new PatternModel(
                commandENUM.INC,
                136
            ),
            new PatternModel(
                commandENUM.SET_RI$R0,
                136,
                {from: 1, to: 7}
            ),
            new PatternModel(
                commandENUM.SET_R0$MEM_RI,
                144,
                {from: 0, to: 7}
            ),
            new PatternModel(
                commandENUM.SET_MEM_RI$R0,
                152,
                {from: 0, to: 7}
            ),
            new PatternModel(
                commandENUM.LOGIC_1,
                160,
                {from: 0, to: 7}
            ),
            new PatternModel(
                commandENUM.LOGIC_2,
                168,
                {from: 0, to: 7}
            ),
            new PatternModel(
                commandENUM.LOGIC_3,
                176,
                {from: 0, to: 7}
            ),
            new PatternModel(
                commandENUM.LOGIC_4,
                184,
                {from: 0, to: 7}
            ),
            new PatternModel(
                commandENUM.MOVE_R0_RI_LESS_RJ,
                192,
                {from: 1, to: 7, mul: 8},
                {from: 1, to: 7}
            ),
            new PatternModel(
                commandENUM.DEC,
                192
            ),
            new PatternModel(
                commandENUM.MOVE_RI,
                192,
                {from: 1, to: 7, mul: 8, duplicate: true}
            ),
            new PatternModel(
                commandENUM.SWAP_R0$RI,
                192,
                {from: 1, to: 7}
            ),
            new PatternModel(
                commandENUM.SWAP_R0$MEM_RI,
                192,
                {from: 1, to: 7, mul: 8}
            )
        ];
    }

    function PatternModel(commandType, start, iInterval, jInterval) {
        this.arr = [];
        this.type = commandType;
        this.start = start;
        this.iInterval = iInterval || null;
        this.jInterval = jInterval || null;

        if (this.iInterval) {
            for (var i = this.iInterval.from; i <= this.iInterval.to; i++) {
                this.arr.push(this.start + (this.iInterval.mul ? i * this.iInterval.mul : i) + (this.iInterval.duplicate ? i : 0));
                if (this.jInterval) {
                    for (var j = this.jInterval.from; j <= this.jInterval.to; j++) {
                        if (i != j) {
                            this.arr.push(this.start + (this.iInterval.mul ? i * this.iInterval.mul : i) + j);
                        }
                    }
                }
            }
        } else {
            this.arr = [this.start];
        }

        this.equal = function (value) {
            return this.arr.some(function (v) {
                return value === v;
            })
        };
        this.getModel = function (value) {
            return {
                type: commandType,
                i: this.getI(value),
                j: this.getJ(value)
            }
        };

        this.getI = function (value) {
            return !this.iInterval ? null : Math.floor((value - this.start) / (this.iInterval.mul ? this.iInterval.mul : 1));
        };

        this.getJ = function (value) {
            return !this.jInterval ? null : (value - this.start) % (this.iInterval.mul ? this.iInterval.mul : 1);
        }
    }
    function init(memory, io) {
        return new Interpreter(
            new Memory(memory),
            new Registers(8),
            io
        );
    }

    return init(memory, io);

});
