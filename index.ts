import { CanFormString, FindWords, StringToFrequencyMap } from "./types";

/**
 * Creates a frequency map of each letter in the string by:
 * - looping through each character
 * - if the character is in the map, increase the count by 1.
 * - otherwise, set the count at 1.
 *
 * @example
 * `createFrequencyMap('hello')  // { h: 1, e: 1, l: 2, o: 1 }`
 *
 * @param inputString - A string consisting of lowercase letters.
 * @returns A frequency map of the string's characters.
 */
export function createFrequencyMap<T extends string>(
  inputString: T,
): StringToFrequencyMap<T> {
  const frequencyMap: { [key: string]: number } = {};
  for (const char of inputString) {
    frequencyMap[char] = (frequencyMap[char] ?? 0) + 1;
  }

  return frequencyMap as StringToFrequencyMap<T>;
}

/**
 * Checks if map2 is a subset of map1.
 *
 * @example
 * `canFormString({ a: 1, t: 1, e: 1 }, { a: 1, t: 1 }) // true`
 *
 * @param map1 - A word character frequency map
 * @param map2 - A word character frequency map to check against map1.
 * @returns true if all of map2's characters appear in map1 and have less-than-or-equal count.
 */
export function canFormString<
  S1 extends { [key: string]: number },
  S2 extends { [key: string]: number },
>(map1: S1, map2: S2): CanFormString<S1, S2> {
  return Object.entries(map2).every(
    ([char, frequency]) => map1[char] !== undefined && map1[char] >= frequency,
  ) as CanFormString<S1, S2>;
}

/**
 * Finds and returns all the words in dictionary that are formable from inputString.
 * A word can be formed by rearranging some or all of the letters in the input string.
 * Each letter in the input string may be used up to once per word.
 *
 * @param inputString - A string consisting of lowercase English letters. The string may contain repeated letters.
 * @param dictionary - An array that specifies the universe of valid output words. You can assume all words will
 *                     consist of lowercase English letters.
 * @returns An array of strings from dictionary that are formable from inputString.
 */
export function findWords<T extends string, Dict extends string[]>(
  inputString: T,
  dictionary: Dict,
): FindWords<T, Dict> {
  // Create the frequency map here instead of in the reduce so that we don't create it each iteration. #saveComputeCycles
  const inputStringFrequencyMap = createFrequencyMap(inputString);

  return dictionary.reduce((acc: string[], word) => {
    const wordFrequencyMap = createFrequencyMap(word);
    if (canFormString(inputStringFrequencyMap, wordFrequencyMap)) {
      acc.push(word);
    }

    return acc;
  }, []) as FindWords<T, Dict>;
}
