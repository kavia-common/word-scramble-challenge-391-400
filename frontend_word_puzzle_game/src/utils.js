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
