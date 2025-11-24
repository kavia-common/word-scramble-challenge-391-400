 // PUBLIC_INTERFACE
 /**
  * Shuffle a word to create a scrambled version. Makes sure scrambled word differs from original.
  * @param {string} word
  * @returns {string} scrambledWord
  */
 export function shuffleWord(word) {
   if (!word || word.length < 2) return word;
   let arr = word.split('');
   let scrambled = word;
   const maxTries = 20;
   let tries = 0;
   // Try shuffling until it's actually different (or max 20 times to avoid infinite loop)
   while (scrambled === word && tries < maxTries) {
     for (let i = arr.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [arr[i], arr[j]] = [arr[j], arr[i]];
     }
     scrambled = arr.join('');
     tries++;
   }
   return scrambled;
 }

 /**
  * Normalize user input by trimming whitespace and converting to lowercase.
  * @param {string} input
  * @returns {string}
  */
 // PUBLIC_INTERFACE
 export function normalizeInput(input) {
   return (input || '').trim().toLowerCase();
 }

 /**
  * Checks if two words are anagrams.
  * @param {string} word1
  * @param {string} word2
  * @returns {boolean}
  */
 // PUBLIC_INTERFACE
 export function isAnagram(word1, word2) {
   if (!word1 || !word2) return false;
   const norm1 = normalizeInput(word1).split('').sort().join('');
   const norm2 = normalizeInput(word2).split('').sort().join('');
   return norm1 === norm2;
 }

 /**
  * Picks a random word from a given list.
  * @param {string[]} wordList
  * @returns {string}
  */
 // PUBLIC_INTERFACE
 export function pickRandomWord(wordList) {
   if (!Array.isArray(wordList) || wordList.length === 0) return '';
   const idx = Math.floor(Math.random() * wordList.length);
   return wordList[idx];
 }

 /**
  * Scrambles a word ensuring the scrambled result is different (if possible).
  * @param {string} word
  * @returns {string}
  */
 // PUBLIC_INTERFACE
 export function scrambleUnique(word) {
   if (!word || word.length < 2) return word;
   let scrambled = word;
   let tries = 0;
   const maxTries = 20;
   while (scrambled === word && tries < maxTries) {
     scrambled = shuffleWord(word);
     tries++;
   }
   return scrambled;
 }

 /**
  * Provide a hint for the word.
  * Returns either the first letter, last letter, or a partial reveal (first + last).
  * @param {string} word
  * @param {'first'|'last'|'both'} [mode]
  * @returns {string}
  */
 // PUBLIC_INTERFACE
 export function getHint(word, mode = 'first') {
   if (!word || word.length === 0) return '';
   if (mode === 'first') return word[0];
   if (mode === 'last') return word[word.length - 1];
   if (mode === 'both') {
     return word.length === 1 ? word : word[0] + '...' + word[word.length - 1];
   }
   // fallback
   return word[0];
 }

 /**
  * Calculate score for a guess.
  * Awards full points for a correct first-try, less for incorrect attempts.
  * @param {string} guess
  * @param {string} answer
  * @param {number} attempts
  * @returns {number}
  */
 // PUBLIC_INTERFACE
 export function scoreGuess(guess, answer, attempts = 1) {
   if (normalizeInput(guess) === normalizeInput(answer)) {
     if (attempts === 1) return 10;
     if (attempts === 2) return 7;
     return 5;
   }
   return 0;
 }
