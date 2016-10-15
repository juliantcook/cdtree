const fs = require('fs');

function File(name, parent) {
    this.name = name;
    this.isSelected = false;
    this.parent = parent;
    this.children;
}

File.prototype.getPath = function() {
    if (this.parent) {
        return this.parent.getPath() + '/' + this.name;
    } else {
        return this.name;
    }
};

File.prototype.isDir = function() {
    return fs.statSync(this.getPath()).isDirectory();
};

File.prototype.loadChildren = function() {
    this.children = fs.readdirSync(this.getPath()).map(fileName => new File(fileName, this));
}

module.exports = File;
