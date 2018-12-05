describe("draw", () => {
    const draw = require('../src/draw-file-tree');
    const File = require('../src/file');
    const colour = require('../src/colours');

    const testDir = 'spec/test.d';

    it("should draw a directory with nothing selected", () => {
        const file = new File(testDir);
        expect(draw(file)).toEqual(`${colour.DIR(testDir)}\n`);
    });

    it('should draw a directory with a single folder inside', () => {
        const file = new File(testDir);
        file.selectChild();
        expect(draw(file)).toEqual(
            `${colour.DIR(testDir)}\n` +
            `├─ ${colour.SELECTED_DIR('single-file.d')}\n`
        );
    });
});
