describe("draw", () => {
    const draw = require('../src/draw-file-tree');
    const File = require('../src/file');
    const clc = require('cli-color');

    const testDir = 'spec/test.d';

    it("should draw a directory with nothing selected", () => {
        const file = new File(testDir);
        expect(draw(file)).toEqual(`${clc.cyan(testDir)}\n`);
    });

    it('should draw a directory with a single folder inside', () => {
        const file = new File(testDir);
        file.selectChild();
        expect(draw(file)).toEqual(
            `${clc.cyan(testDir)}\n` +
            `├─ ${clc.cyan.black.bgYellow('single-file.d')}\n`
        );
    });
});
