﻿require('../../../src/Core/iServer/BufferDistance');

describe('testBufferDistance_constructor',function(){
    it('constructorDefault',function(){
        var bufferDistance = new BufferDistance();
        expect(bufferDistance).not.toBeNull();
        expect(bufferDistance.value).toEqual(100);
        expect(bufferDistance.exp).toBeNull();

        bufferDistance.destroy();
        expect(bufferDistance.value).toBeNull();
        expect(bufferDistance.exp).toBeNull();
    });
    it('constructorCustom',function(){
        var bufferDistance = new BufferDistance({
            value: 200
        });
        expect(bufferDistance).not.toBeNull();
        expect(bufferDistance.value).toEqual(200);
        expect(bufferDistance.exp).toBeNull();

        bufferDistance.destroy();
        expect(bufferDistance.value).toBeNull();
        expect(bufferDistance.exp).toBeNull();
    });
});





