const clc = require('cli-color');

// TODO memoize
const drawDepth = depth => {
    if (depth == 0) return '';
    var string = '├─';
    for (var i = 1; i < depth; i++) {
        string = '   ' + string;
    }
    return string + ' ';
};

const drawName = file => {
    var clcFunc = file.isDir ? clc.cyan : clc;
    return file.isSelected ? clcFunc.black.bgYellow(file.name) : clcFunc(file.name);
};

const draw = (file, depth = 0) => {
    var output = drawDepth(depth) + drawName(file) + '\n';
    if(file.children) {
        depth++;
        file.children.forEach(child => {
            output += draw(child, depth);
        });
    }
    return output;
};

module.exports = draw;
