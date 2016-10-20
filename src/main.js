#!/usr/bin/env node

const vorpal = require('vorpal')();
const File = require('./file');
const draw = require('./draw-file-tree');
const fs = require('fs');

var rootFile = new File('.');
var selected = rootFile.selectChild();

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

const outputSelection = selection => {
    fs.writeFileSync('/tmp/cdtree_selection', selection);
};

var makeSelection = () => {
    vorpal.ui.redraw.clear();
    outputSelection(selected.getPath());
    process.exit(0);
};

vorpal.on('client_prompt_submit', makeSelection);

vorpal.delimiter('').show();
