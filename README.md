# Approach
At a high level, I approached the problem as follows:
1. Initialize an empty array to be used as the result set.
2. Loop through every word "w" in the dictionary.
3. If "w" is a subset of the input word (Does input word contains fewer or equal counts of each letter in "w"?)
   1. Then: add to the result set
   2. Otherwise, don't add to the result set.

To determine if a word was a subset of another word, I converted each word into a frequency map.
The map had keys corresponding to each unique letter in the word, and a value corresponding to the number of times that
letter appeared in the word.
Then I checked if the dictionary word had fewer or equal counts for each letter in the dictionary word.

This approach could have been optimized further by terminating the comparison early if the words were of different length
or if a letter was found that wasn't in the input word (while creating the map).

> A TypeScript solution would be ideal given that’s our tech stack,
> but other modern languages (e.g. Python) are fine too.

I took this literally and decided to create TypeScript types for each function.
The types actually compute the result for each step. Read more in the JSDocs in `types.ts`.

## How to Test
In the root directory of the project start with
`npm i` to install the project dependencies.

Test with `npm run test` to run the JS test cases.

If I had more time, I would have tested each TS function and added some more tests for the `findWords` function.

## Important Files
* `index.ts` has all of the TypeScript functions
* `index.test.ts` has all of the Jest tests for the `findWords` function in `index.ts`
* `types.ts` has all of the TypeScript types and some type tests, too. 

## Notes:
- I used Typescript v5.4.3. Some features may only be available in this major version
