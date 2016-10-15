const vorpal = require('vorpal')();
const File = require('./file');
const draw = require('./draw-file-tree');

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

var makeSelection = () => {
    vorpal.ui.redraw.clear();
    process.stdout.write(selected.getPath());
    process.exit(0);
};

vorpal.on('client_prompt_submit', makeSelection);

vorpal
    .delimiter('cdtree$')
    .show();
