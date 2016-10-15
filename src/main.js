const vorpal = require('vorpal')();
const clc = require('cli-color');
const fs = require('fs');

var rootFile = new File('.');
rootFile.children = getChildren(rootFile);
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
    var clcFunc = isDir(file) ? clc.cyan : clc;
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
    if(!isDir(selected)) return;
    selected.children = getChildren(selected);
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
    process.stdout.write(getPath(selected));
    process.exit(0);
};

vorpal.on('client_prompt_submit', makeSelection);

vorpal
    .delimiter('cdtree$')
    .show();


function getPath(file) {
    if (file.parent) {
        return getPath(file.parent) + '/' + file.name;
    } else {
        return file.name;
    }
}

function isDir(file) {
    return fs.statSync(getPath(file)).isDirectory();
}

function getChildren(file) {
    return fs.readdirSync(getPath(file)).map(fileName => new File(fileName, file));
}

function File(name, parent) {
    this.name = name;
    this.isSelected = false;
    this.parent = parent;
    this.children;
}
