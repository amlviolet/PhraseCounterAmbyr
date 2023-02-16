const fs = require('fs');

jest.mock('fs');
const topPhrases = require('../topPhrases');

const mockConsole = jest
.spyOn(console, 'error')
.mockImplementation(() => { });

describe('Phrase Counter Stream', () => {

    test('File name not provided', () => {

        topPhrases.getTopPhrases();

        expect(mockConsole).toHaveBeenCalled();
        expect(mockConsole).toHaveBeenCalledWith(
            expect.stringContaining('File name not provided.')
        );
    });

    test('File not found', () => {

        const fakeFile = 'fake.js'

        const mockReadStream = {
            on: jest.fn().mockImplementation(function (event, handler) {
                if (event === 'error') {
                    handler({ message: `error` })
                }
                return this;
            }),
        };
        fs.createReadStream.mockReturnValueOnce(mockReadStream);

        topPhrases.getTopPhrases(fakeFile);


        expect(mockReadStream.on).toBeCalledWith('error', expect.any(Function));
        expect(mockConsole).toBeCalledTimes(1);
    });

    test('Empty stream', () => {
        const testFile = 'test.txt'
        const mockReadStream = {
            on: jest.fn().mockImplementation(function (event, handler) {
                if (event === 'data') {
                    handler()
                }
                return this;
            }),
        };
        fs.createReadStream.mockReturnValueOnce(mockReadStream);

        topPhrases.getTopPhrases(testFile);

        expect(mockReadStream.on).toBeCalledWith('data', expect.any(Function));
        expect(mockConsole).toHaveBeenCalled();
        expect(mockConsole).toHaveBeenCalledWith(
            expect.stringContaining('File name not provided.')
        );

    });

})
