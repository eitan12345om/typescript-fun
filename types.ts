import { Add, LtOrEq } from "ts-arithmetic";

/**
 * Converts a string to a frequency map, where each key is a lowercase character from the string,
 * and its value is the number of times the character appears in the string.
 *
 * How it works:
 * We can use type inferences to grab each Char from the string S.
 * Our base case for the recursion is if Char is an empty string. If that is the case, we return our accumulator object holding the counts.
 *
 * When Char is not empty,
 *   we Lowercase char so that "m" and "M" are treated the same,
 *   Omit it from the Accumulator because otherwise we may end up with {b: 1} & {b: 2} which yields never if a word has two b's for example.
 *   Add it back into the type with a new count.
 *
 * @typeParam S - A string from which the frequency map is generated.
 * @typeParam Acc - An accumulator object used during the recursion. Initially an empty object.
 * @returns A frequency map where each key is a lowercase character from the string S,
 *          and each value is the number of times that character appears in S.
 */
export type StringToFrequencyMap<
  S extends string,
  Acc extends { [key: string]: number } = {},
> = S extends `${infer Char}${infer Rest}`
  ? StringToFrequencyMap<
      Rest,
      Omit<Acc, Lowercase<Char>> & {
        [K in Lowercase<Char>]: K extends keyof Acc ? Add<Acc[K], 1> : 1;
      }
    >
  : Acc;

/**
 * Normalizes a type to `false` if it includes any ambiguity (e.g., `true | false`),
 * and retains `true` if the type is strictly `true` or `never`. This is useful for enforcing stricter
 * boolean checks and ensuring that types like `true | false` are explicitly recognized
 * and handled as `false`.
 *
 * How it works:
 * A normal check like `boolean extends T` would apply each value of boolean (alias for true | false) to the extends conditional and unite the results.
 * So `boolean extends T` === `true extends T | false extends T`. This would lead to an edge case where if T === boolean, we would get back boolean. But we want false in that case.
 * Putting the array brackets around both checks the union together instead of separately.
 *
 * @typeParam T - The boolean type to be converted.
 * @returns `false` if T is a union, otherwise the original type T.
 * @private
 */
type NormalizeBoolean<T> = [T] extends [never]
  ? true
  : [boolean] extends [T]
    ? false
    : T;

/**
 * Determines if the second string can be formed from the first string based on character frequency.
 *
 * How it works:
 * `[K in keyof S2]` essentially creates a loop for every character, K, in S2
 * `K extends keyof S1` checks if K is a key of S1
 *   if it is, then the key gets a value of true if S2 has fewer or equal to the number of times the character appears in S1. Otherwise false.
 *   otherwise, the key gets a value of false
 * We end up with an object with keys which are characters from S2 and values of true or false.
 * `[keyof S2]` gets the values of the object, yielding true, false, or boolean (alias for true | false).
 * NormalizeBoolean converts the boolean to a false. This is a good thing because this means at least one character appeared too many times in S2.
 *
 * @typeParam S1 - The frequency map of the first string.
 * @typeParam S2 - The frequency map of the second string.
 * @returns `true` if the second string can be formed from the first, `false` otherwise.
 */
export type CanFormString<
  S1 extends { [key: string]: number },
  S2 extends { [key: string]: number },
> = NormalizeBoolean<
  {
    [K in keyof S2]: K extends keyof S1
      ? LtOrEq<S2[K], S1[K]> extends 1
        ? true
        : false
      : false;
  }[keyof S2]
>;

/**
 * Finds all words from a dictionary that can be formed with the letters of the given string.
 *
 * How it works:
 * We recurse through each element, Head, in Dict and check if a string can be formed.
 * If it can, append to the array, otherwise, return the array.
 *
 * @typeParam S - The string to use for forming words.
 * @typeParam Dict - An array of strings representing the dictionary.
 * @typeParam Acc - An accumulator for the words that can be formed. Initially an empty array.
 * @typeParam Smap - The frequency map of the string S. Initially generated from S.
 * @returns An array of strings that can be formed from S using the dictionary Dict.
 */
export type FindWords<
  S extends string,
  Dict extends string[],
  Acc extends string[] = [],
  Smap extends { [key: string]: number } = StringToFrequencyMap<S>,
> = Dict extends [infer Head extends string, ...infer Tail extends string[]]
  ? CanFormString<Smap, StringToFrequencyMap<Head>> extends true
    ? FindWords<S, Tail, [...Acc, Head], Smap>
    : FindWords<S, Tail, Acc, Smap>
  : Acc;

// Testing the types
// If there's a type error, the test failed.
const testStringToFrequencyMap__oneCharacter: StringToFrequencyMap<"a"> = {
  a: 1,
};
const testStringToFrequencyMap__emptyString: StringToFrequencyMap<""> = {};
const testStringToFrequencyMap__word: StringToFrequencyMap<"apple"> = {
  a: 1,
  p: 2,
  l: 1,
  e: 1,
};

const testNormalizeBoolean__true: NormalizeBoolean<true> = true;
const testNormalizeBoolean__false: NormalizeBoolean<false> = false;
const testNormalizeBoolean__boolean: NormalizeBoolean<boolean> = false;

const testCanFormString__bothEmpty: CanFormString<
  StringToFrequencyMap<"">,
  StringToFrequencyMap<"">
> = true;
const testCanFormString__firstStringEmpty: CanFormString<
  StringToFrequencyMap<"">,
  StringToFrequencyMap<"apple">
> = false;
const testCanFormString__secondStringEmpty: CanFormString<
  StringToFrequencyMap<"apple">,
  StringToFrequencyMap<"">
> = true;
const testCanFormString__formableString: CanFormString<
  StringToFrequencyMap<"example">,
  StringToFrequencyMap<"map">
> = true;
const testCanFormString__nonFormableString: CanFormString<
  StringToFrequencyMap<"example">,
  StringToFrequencyMap<"maps">
> = false;

const testFindWords__emptyStringAndDict: FindWords<"", []> = [];
const testFindWords__emptyDict: FindWords<"apple", []> = [];
const testFindWords__emptyString: FindWords<"", ["map", "pam"]> = [];
const testFindWords__canFindStrings: FindWords<
  "example",
  ["map", "pam", "dog", "cat", "lax", "plea", "exams"]
> = ["map", "pam", "lax", "plea"];
const testFindWords__noStrings: FindWords<"example", ["dog", "cat", "banana"]> =
  [];
