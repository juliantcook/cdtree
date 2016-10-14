const vorpal = require('vorpal')();
const clc = require('cli-color');
const fs = require('fs');

var rootFile = new File('.');
rootFile.children = getChildren(rootFile);
var selected = rootFile.children[0];
selected.isSelected = true;

var getDepthString = (depth) => {
    if (depth == 0) return '';
    var string = '├─';
    for (var i = 1; i < depth; i++) {
        string = '   ' + string;
    }
    return string + ' ';
};

var getName = file => {
    return file.isSelected ? clc.black.bgYellow(file.name) : file.name;
};

var draw = (file, depth) => {
    var output = getDepthString(depth) + getName(file) + '\n';
    if(file.children) {
        depth++;
        file.children.forEach(child => {
            output += draw(child, depth);
        });
    }
    return output;
};

var redraw = function() {
    vorpal.ui.redraw.clear();
    vorpal.ui.redraw(draw(rootFile, 0));
};

redraw();

var getCurrentBranch = function(file) {
    var openDir = file.children.find(child => child.children);
    if (!openDir) {
        return file.children;
    } else {
        return getCurrentBranch(openDir);
    }
};

var selectSibling = function(offset) {
    var currentBranch = getCurrentBranch(rootFile);
    var idx = currentBranch.findIndex(child => child.isSelected);
    currentBranch[idx].isSelected = false;
    idx += offset;
    if (idx < 0) {
        idx = currentBranch.length - 1;
    } else if (idx == currentBranch.length) {
        idx = 0;
    }
    selected = currentBranch[idx];
    selected.isSelected = true;
};

var selectChild = function() {
    if(!isDir(selected)) return;
    selected.children = getChildren(selected);
    selected.children[0].isSelected = true;
    selected.isSelected = false;
    selected = selected.children[0];
};

var selectParent = function() {
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
