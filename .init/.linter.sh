#!/bin/bash
cd /tmp/kavia/workspace/code-generation/word-scramble-challenge-391-400/frontend_word_puzzle_game
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

