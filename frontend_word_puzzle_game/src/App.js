import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './components/components.css';
import { Button, Navbar } from './components';
import {
  shuffleWord,
  normalizeInput,
  isAnagram,
  pickRandomWord,
  scrambleUnique,
  getHint,
  scoreGuess
} from './utils';

// List of 15+ words to randomize, all lowercase for simplicity
const WORD_LIST = [
  "magnolia", "computer", "umbrella", "elephant", "strategy", "envelope",
  "rainbow", "journey", "mountain", "scramble", "keyboard", "kangaroo",
  "sandwich", "galaxy", "treasure", "dolphin", "festival", "bicycle"
];

// Styling colors
const COLORS = {
  primary: "#3b82f6",
  success: "#06b6d4",
  error: "#EF4444",
  surface: "#ffffff",
  background: "#f9fafb",
  card: "#fff",
  cardShadow: "rgba(59, 130, 246, 0.10)"
};

// PUBLIC_INTERFACE
function App() {
  // State for the game
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(null); // null | boolean
  const [feedback, setFeedback] = useState('');
  const [showAnim, setShowAnim] = useState(false);

  const inputRef = useRef();

  // Choose a random word and scramble it
  const getNewPuzzle = () => {
    const word = pickRandomWord(WORD_LIST);
    // Use the new "scrambleUnique" which internally calls shuffleWord and ensures a different output
    let scrambled = scrambleUnique(word);
    setCurrentWord(word);
    setScrambledWord(scrambled);
    setUserGuess('');
    setIsCorrect(null);
    setFeedback('');
    setShowAnim(false);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 100); // Focus input
  };

  // On mount, get first puzzle
  useEffect(() => {
    getNewPuzzle();
    // eslint-disable-next-line
  }, []);

  // Handle guess submit (button or Enter key)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Normalize input and answer for robust checking
    const normGuess = normalizeInput(userGuess);
    const normAnswer = normalizeInput(currentWord);

    if (!normGuess) return;
    if (normGuess === normAnswer) {
      setIsCorrect(true);
      setFeedback('🎉 Correct! Well done!');
    } else {
      setIsCorrect(false);
      setFeedback('❌ Try again!');
    }
    setShowAnim(true);
  };

  // Typing input resets feedback and error
  const handleInputChange = (e) => {
    setUserGuess(e.target.value);
    setIsCorrect(null);
    setFeedback('');
    setShowAnim(false);
    // Could use getHint, isAnagram, scoreGuess, etc., if expanding in the future
  };

  // Keyboard: allow Enter to submit form
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && userGuess.trim()) {
      handleSubmit(e);
    }
  };

  // Compute feedback color and animation
  let feedbackStyle = {};
  if (isCorrect === true) {
    feedbackStyle = {
      color: COLORS.success,
      background: 'rgba(6, 182, 212, 0.1)',
      borderColor: COLORS.success,
      animation: showAnim ? 'pulseScale 0.6s cubic-bezier(.6,-0.28,.74,.05) both' : 'none'
    };
  } else if (isCorrect === false) {
    feedbackStyle = {
      color: COLORS.error,
      background: 'rgba(239, 68, 68, 0.11)',
      borderColor: COLORS.error,
      animation: showAnim ? 'shakeX 0.45s cubic-bezier(.36,.07,.19,.97) both' : 'none'
    };
  }
  // Main card styles
  const cardStyle = {
    background: COLORS.card,
    boxShadow: `0 6px 32px 6px ${COLORS.cardShadow}`,
    borderRadius: '20px',
    padding: '2rem 1.5rem 1.25rem 1.5rem',
    width: 'min(92vw, 400px)',
    margin: '2.5rem auto 2rem auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };
  // App container (centered)
  const appStyle = {
    minHeight: '100vh',
    background: COLORS.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div className="App" style={appStyle}>
      <Navbar
        title="Word Scramble Challenge"
        // tagline="Unscramble the letters, have fun learning!"
      />

      <div style={cardStyle} role="main" aria-label="Word scramble game card">
        {/* Scrambled word */}
        <div
          style={{
            fontSize: '2.2rem',
            fontWeight: 600,
            letterSpacing: '.09em',
            margin: '0 0 1.25rem 0',
            color: COLORS.primary,
            userSelect: 'none'
          }}
          aria-label="Scrambled word"
        >
          {scrambledWord}
        </div>

        {/* Input & button */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
          aria-label="Word unscramble form"
        >
          <label htmlFor="guess-input" style={{ fontWeight: 500, fontSize: '1.07rem', marginBottom: '0.2em' }}>
            Your guess:
          </label>
          <input
            id="guess-input"
            ref={inputRef}
            value={userGuess}
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
            maxLength="24"
            autoFocus
            aria-label="Your guess"
            aria-describedby="guess-help"
            aria-invalid={isCorrect === false}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            style={{
              fontSize: '1.2rem',
              padding: '0.55em 1em',
              border: `2px solid ${isCorrect === false ? COLORS.error : COLORS.primary}`,
              borderRadius: '11px',
              outline: 'none',
              marginBottom: ".9em",
              width: "96%",
              boxSizing: "border-box",
              background: "#f3f6fa"
            }}
            disabled={isCorrect === true}
          />
          <span id="guess-help" style={{ fontSize: "0.93em", color: "#64748b", marginBottom: "0.3em" }}>
            Unscramble the word above.
          </span>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="game-submit-btn"
            // solid primary for submit button
            disabled={!userGuess.trim() || isCorrect === true}
            aria-disabled={!userGuess.trim() || isCorrect === true}
            style={{ marginBottom: "0.7em", marginTop: "0.2em", width: "auto" }}
          >
            Submit Guess
          </Button>
        </form>
        {/* Live feedback */}
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            minHeight: "2.5em",
            margin: "0.2em 0 0.3em 0",
            fontSize: isCorrect !== null ? "1.22rem" : "1.11rem",
            fontWeight: 600,
            borderRadius: "8px",
            border: isCorrect !== null ? `2px solid ${feedbackStyle.borderColor}` : "none",
            padding: isCorrect !== null ? "0.37em 1em" : "0",
            background: isCorrect !== null ? feedbackStyle.background : undefined,
            color: isCorrect !== null ? feedbackStyle.color : "#64748b",
            transition: "all 0.28s cubic-bezier(.8, .5, .3, 1.2)"
          }}
          className={showAnim ? (isCorrect ? "correct-animate" : "error-animate") : ""}
        >
          {feedback}
        </div>

        <Button
          onClick={getNewPuzzle}
          variant="secondary"
          outline={true}
          size="sm"
          className="try-another-btn"
          aria-label="Try another word"
          style={{
            marginTop: "1.15em",
            // Remove manual border/color/bg (handled by outline secondary)
          }}
        >
          Try another word
        </Button>
      </div>
      {/* Footer */}
      <footer style={{
        marginTop: "2.5rem",
        color: "#64748b",
        fontSize: "1rem"
      }}>
        Made with <span aria-label="love" role="img" style={{ color: COLORS.error, fontWeight: 600 }}>❤️</span>{' '}
        <a href="#" style={{
          color: COLORS.primary,
          textDecoration: "none",
          borderBottom: `1.5px dotted ${COLORS.primary}`,
          marginLeft: "2px"
        }}>Kavia</a>
      </footer>
      {/* Animations in style tag */}
      <style>
        {`
          @keyframes shakeX {
            10%, 90% { transform: translateX(-1px);}
            20%, 80% { transform: translateX(2px);}
            30%, 50%, 70% { transform: translateX(-4px);}
            40%, 60% { transform: translateX(4px);}
          }
          @keyframes pulseScale {
            0% { transform: scale(0.97);}
            30% { transform: scale(1.07);}
            60% { transform: scale(0.99);}
            80% { transform: scale(1.03);}
            100% { transform: scale(1);}
          }
        `}
      </style>
    </div>
  );
}

export default App;
