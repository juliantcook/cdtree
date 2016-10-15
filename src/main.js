const vorpal = require('vorpal')();
const clc = require('cli-color');
const File = require('./file');

var rootFile = new File('.');
rootFile.loadChildren();
var selected = rootFile.children[0];
selected.isSelected = true;

var getDepthString = depth => {
    if (depth == 0) return '';
    var string = '├─';
    for (var i = 1; i < depth; i++) {
        string = '   ' + string;
    }
    return string + ' ';
};

var drawName = file => {
    var clcFunc = file.isDir() ? clc.cyan : clc;
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

var selectSibling = offset => {
    if (!selected.parent) return;
    var siblings = selected.parent.children;
    var idx = siblings.findIndex(child => child.isSelected);
    siblings[idx].isSelected = false;
    idx += offset;
    if (offset < 0) {
        idx = Math.max(idx, 0);
    } else {
        idx = Math.min(idx, siblings.length - 1);
    }
    selected = siblings[idx];
    selected.isSelected = true;
};

var selectChild = () => {
    if(!selected.isDir()) return;
    selected.loadChildren();
    selected.children[0].isSelected = true;
    selected.isSelected = false;
    selected = selected.children[0];
};

var selectParent = () => {
    if (!selected.parent) return;
    selected.isSelected = false;
    selected.parent.isSelected = true;
    selected = selected.parent;
    selected.children = null;
};

vorpal.on('keypress', function(keys) {
    switch(keys.key) {
        case 'down':
            selectSibling(1);
        break;
        case 'up':
            selectSibling(-1);
        break;
        case 'right':
            selectChild();
        break;
        case 'left':
            selectParent();
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
