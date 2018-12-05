const colour = require('./colours');

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
    let colourFn = x => x;
    if (file.isDir && file.isSelected) colourFn = colour.SELECTED_DIR;
    else if (file.isDir) colourFn = colour.DIR;
    else if (file.isSelected) colourFn = colour.SELECTED;
    return colourFn(file.name);
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
