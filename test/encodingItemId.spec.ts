import {
  encodeItemId,
  decodeItemId,
  decodeHexItemId,
} from "../src/modules/evm";

describe("Item ID Encoding and Decoding", () => {
  it("should encode and decode the item id without loss", () => {
    const originalItemId = "i-x0gaz03w8xhxOfp";
    const encoded = encodeItemId(originalItemId);
    const decoded = decodeItemId(encoded.toString());
    expect(decoded).toEqual(originalItemId);
  });
});

describe("decodeHexItemId", () => {
  it("should decode hex item ID correctly", () => {
    expect(
      decodeHexItemId(
        "0000000000000000000000000000000000783067617a303377387868784f6670",
      ),
    ).toBe("i-x0gaz03w8xhxOfp");
  });
});

describe("decodeItemId", () => {
  it("should decode 64-length hex item IDs", () => {
    expect(
      decodeItemId(
        "0000000000000000000000000000000000783067617a303377387868784f6670",
      ),
    ).toBe("i-x0gaz03w8xhxOfp");
  });

  it("should decode decimal item IDs", () => {
    expect(
      decodeItemId("105045120048103097122048051119056120104120079102112"),
    ).toBe("i-x0gaz03w8xhxOfp");
  });
});
