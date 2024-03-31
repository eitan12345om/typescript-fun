import { findWords } from "./index";

describe("findWords", () => {
  it("should return the formable words from the dictionary", () => {
    expect(
      findWords("ate", [
        "ate",
        "eat",
        "tea",
        "dog",
        "do",
        "god",
        "goo",
        "go",
        "good",
      ]),
    ).toEqual(["ate", "eat", "tea"]);
  });

  it("should return an empty array when the string is empty", () => {
    expect(
      findWords("", [
        "ate",
        "eat",
        "tea",
        "dog",
        "do",
        "god",
        "goo",
        "go",
        "good",
      ]),
    ).toEqual([]);
  });

  it("should return an empty array when the dictionary is empty", () => {
    expect(findWords("ate", [])).toEqual([]);
  });
});
