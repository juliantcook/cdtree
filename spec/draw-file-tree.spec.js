describe("draw", () => {
    const draw = require('../src/draw-file-tree');
    const File = require('../src/file');

    // TODO how to test text colour?
    it("should draw a directory with nothing selected", () => {
        const file = new File('spec/test.d');
        expect(draw(file)).toEqual('spec/test.d\n');
    });
});
