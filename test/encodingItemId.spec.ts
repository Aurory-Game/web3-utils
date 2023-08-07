import { encodeItemId, decodeItemId } from '../src/modules/evm';

describe('Item ID Encoding and Decoding', () => {
  
  it('should encode and decode the item id without loss', () => {
    const originalItemId = 'i-x0gaz03w8xhxOfp';
    const encoded = encodeItemId(originalItemId);
    const decoded = decodeItemId(encoded);
    expect(decoded).toEqual(originalItemId);
  });

  it('should produce a 64 character long encoded item id', () => {
    const originalItemId = 'i-x0gaz03w8xhxOfp';
    const encoded = encodeItemId(originalItemId);
    expect(encoded.length).toEqual(64);
  });
});

