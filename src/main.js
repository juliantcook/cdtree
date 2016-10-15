const vorpal = require('vorpal')();
const clc = require('cli-color');
const File = require('./file');

var rootFile = new File('.');
var selected = rootFile.selectChild();

// TODO memoize
var getDepthString = depth => {
    if (depth == 0) return '';
    var string = '├─';
    for (var i = 1; i < depth; i++) {
        string = '   ' + string;
    }
    return string + ' ';
};

var drawName = file => {
    var clcFunc = file.isDir ? clc.cyan : clc;
    return file.isSelected ? clcFunc.black.bgYellow(file.name) : clcFunc(file.name);
};

var draw = (file, depth) => {
    var output = getDepthString(depth) + drawName(file) + '\n';
    if(file.children) {
        depth++;
        file.children.forEach(child => {
            output += draw(child, depth);
        });
    }
    return output;
};

var redraw = () => {
    vorpal.ui.redraw.clear();
    vorpal.ui.redraw(draw(rootFile, 0));
};

redraw();

vorpal.on('keypress', function(keys) {
    switch(keys.key) {
        case 'down':
            selected = selected.selectSibling(1);
        break;
        case 'up':
            selected = selected.selectSibling(-1);
        break;
        case 'right':
            selected = selected.selectChild();
        break;
        case 'left':
            selected = selected.selectParent();
        break;
    }
    redraw();
});

var makeSelection = () => {
    vorpal.ui.redraw.clear();
    process.stdout.write(selected.getPath());
    process.exit(0);
};

vorpal.on('client_prompt_submit', makeSelection);

vorpal
    .delimiter('cdtree$')
    .show();
