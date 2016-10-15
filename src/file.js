const fs = require('fs');

function File(name, parent) {
    this.name = name;
    this.isSelected = false;
    this.parent = parent;
    this.children;
    this.isDir = fs.statSync(this.getPath()).isDirectory();
}

File.prototype.getPath = function() {
    if (this.parent) {
        return this.parent.getPath() + '/' + this.name;
    } else {
        return this.name;
    }
};

File.prototype.loadChildren = function() {
    this.children = fs.readdirSync(this.getPath()).map(fileName => new File(fileName, this));
};

File.prototype.selectChild = function() {
    if (!this.isDir) return this;
    this.loadChildren();
    this.isSelected = false;
    return this.children[0].select();
};

File.prototype.selectParent = function() {
    if (!this.parent) return this;
    this.isSelected = false;
    this.parent.children = null;
    return this.parent.select();
};

File.prototype.selectSibling = function(offset) {
    if (!this.parent) return this;
    var siblings = this.parent.children;
    var idx = siblings.findIndex(child => child.isSelected);
    idx += offset;
    if (offset < 0) {
        idx = Math.max(idx, 0);
    } else {
        idx = Math.min(idx, siblings.length - 1);
    }
    this.isSelected = false;
    return siblings[idx].select();
};

File.prototype.select = function() {
    this.isSelected = true;
    return this;
};

module.exports = File;
