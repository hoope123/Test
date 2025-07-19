const { gmd, config, commands, fetchJson } = require('../gift'),
  fs = require('fs'),
  path = require('path'),
  { PREFIX: prefix } = config;
  
  let activeTrivia = {};//for the trivia game 
  
let activeGames = {}; // Store active games per chat. for guessword game 
  
const words = [
  'banana', 'elephant', 'computer', 'pineapple',
  'whatsapp', 'robotics', 'darkcode', 'gifted',
  'telegram', 'internet'
]; //available words for the guessword game 

// Shuffle the word
const shuffleWord = (word) => {
  return word.split('').sort(() => Math.random() - 0.5).join('');
};

  
  
  
// Game state manager - handles multiple concurrent games across different chats
class TicTacToeManager {
  constructor() {
    // Store all active games: Map<groupJID, Map<gameId, GameState>>
    this.games = new Map();
    
    // Game timeout (5 minutes of inactivity)
    this.gameTimeout = 5 * 60 * 1000;
    
    // Store timeout IDs to clear them when needed
    this.timeouts = new Map();
  }
  
  // Create a new game between two players
  createGame(groupJid, player1, player2) {
    // Generate a unique game ID using player JIDs
    const gameId = `${player1}:${player2}`;
    
    // Initialize group map if needed
    if (!this.games.has(groupJid)) {
      this.games.set(groupJid, new Map());
    }
    
    const groupGames = this.games.get(groupJid);
    
    // Check if either player is already in a game in this group
    for (const [existingGameId, game] of groupGames.entries()) {
      if (game.players.includes(player1) || game.players.includes(player2)) {
        return {
          success: false,
          message: `One of the players is already in a game. Please finish that game first.`
        };
      }
    }
    
    // Create new game state
    const gameState = {
      players: [player1, player2],
      board: Array(9).fill(null),
      currentPlayer: player1, // Player 1 goes first
      symbols: {
        [player1]: '❌',
        [player2]: '⭕'
      },
      startTime: Date.now(),
      lastMoveTime: Date.now()
    };
    
    // Store the game
    groupGames.set(gameId, gameState);
    
    // Set game timeout
    this.setGameTimeout(groupJid, gameId);
    
    return {
      success: true,
      message: `Game created between @${player1.split('@')[0]} (❌) and @${player2.split('@')[0]} (⭕)`,
      gameId,
      gameState
    };
  }
  
  // Make a move in a game
  makeMove(groupJid, playerId, position) {
    // Validate group exists
    if (!this.games.has(groupJid)) {
      return {
        success: false,
        message: "No active games in this chat."
      };
    }
    
    const groupGames = this.games.get(groupJid);
    
    // Find the game this player is in
    let gameId = null;
    let gameState = null;
    
    for (const [id, game] of groupGames.entries()) {
      if (game.players.includes(playerId)) {
        gameId = id;
        gameState = game;
        break;
      }
    }
    
    // No game found for this player
    if (!gameState) {
      return {
        success: false,
        message: "You're not in an active game. Start one by replying to someone with !ttt"
      };
    }
    
    // Check if it's the player's turn
    if (gameState.currentPlayer !== playerId) {
      return {
        success: false,
        message: "It's not your turn!"
      };
    }
    
    // Validate position (0-8)
    if (position < 0 || position > 8 || !Number.isInteger(position)) {
      return {
        success: false,
        message: "Invalid position! Choose a number between 1-9."
      };
    }
    
    // Check if the position is already taken
    if (gameState.board[position] !== null) {
      return {
        success: false,
        message: "That position is already taken! Choose another."
      };
    }
    
    // Make the move
    gameState.board[position] = gameState.symbols[playerId];
    
    // Update last move time
    gameState.lastMoveTime = Date.now();
    
    // Reset the timeout
    this.setGameTimeout(groupJid, gameId);
    
    // Check for win or draw
    const winner = this.checkWinner(gameState.board);
    let result = null;
    
    if (winner) {
      // We have a winner
      result = {
        status: 'win',
        winner: playerId,
        symbol: gameState.symbols[playerId]
      };
      
      // Remove the game
      groupGames.delete(gameId);
      
      // Clear timeout
      if (this.timeouts.has(`${groupJid}:${gameId}`)) {
        clearTimeout(this.timeouts.get(`${groupJid}:${gameId}`));
        this.timeouts.delete(`${groupJid}:${gameId}`);
      }
    } else if (!gameState.board.includes(null)) {
      // It's a draw - no more moves possible
      result = {
        status: 'draw'
      };
      
      // Remove the game
      groupGames.delete(gameId);
      
      // Clear timeout
      if (this.timeouts.has(`${groupJid}:${gameId}`)) {
        clearTimeout(this.timeouts.get(`${groupJid}:${gameId}`));
        this.timeouts.delete(`${groupJid}:${gameId}`);
      }
    } else {
      // Switch to next player
      gameState.currentPlayer = gameState.players[0] === playerId ? gameState.players[1] : gameState.players[0];
    }
    
    // Clean up if group has no more games
    if (groupGames.size === 0) {
      this.games.delete(groupJid);
    }
    
    return {
      success: true,
      board: gameState.board,
      result,
      nextPlayer: gameState.currentPlayer
    };
  }
  
  // Get current game state for a player
  getGameState(groupJid, playerId) {
    // Check if group exists
    if (!this.games.has(groupJid)) {
      return null;
    }
    
    const groupGames = this.games.get(groupJid);
    
    // Find player's game
    for (const [gameId, game] of groupGames.entries()) {
      if (game.players.includes(playerId)) {
        return {
          gameId,
          gameState: game
        };
      }
    }
    
    return null;
  }
  
  // Format board for display
  formatBoard(board) {
    // Unicode characters for better display
    const horizontalLine = '┄┄┄┄┄┄┄┄┄┄┄';
    const verticalLine = '┃';
    
    // Number emojis for empty spaces (for position selection)
    const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    
    let formattedBoard = `${horizontalLine}\n`;
    
    for (let i = 0; i < 3; i++) {
      let row = `${verticalLine} `;
      for (let j = 0; j < 3; j++) {
        const pos = i * 3 + j;
        const cell = board[pos] || numberEmojis[pos];
        row += `${cell} `;
        if (j < 2) row += verticalLine + ' ';
      }
      row += `${verticalLine}`;
      formattedBoard += row + '\n';
      
      if (i < 2) {
        formattedBoard += `${horizontalLine}\n`;
      }
    }
    
    formattedBoard += `${horizontalLine}`;
    return formattedBoard;
  }
  
  // Check for a winner
  checkWinner(board) {
    // Winning patterns - rows, columns, diagonals
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    
    return null;
  }
  
  // Set a timeout to end inactive games
  setGameTimeout(groupJid, gameId) {
    // Clear existing timeout if any
    if (this.timeouts.has(`${groupJid}:${gameId}`)) {
      clearTimeout(this.timeouts.get(`${groupJid}:${gameId}`));
    }
    
    // Set new timeout
    const timeoutId = setTimeout(() => {
      if (this.games.has(groupJid)) {
        const groupGames = this.games.get(groupJid);
        if (groupGames.has(gameId)) {
          groupGames.delete(gameId);
          
          // Clean up if no more games in group
          if (groupGames.size === 0) {
            this.games.delete(groupJid);
          }
        }
      }
      
      this.timeouts.delete(`${groupJid}:${gameId}`);
    }, this.gameTimeout);
    
    this.timeouts.set(`${groupJid}:${gameId}`, timeoutId);
  }
  
  // Force end a game
  endGame(groupJid, playerId) {
    // Check if group exists
    if (!this.games.has(groupJid)) {
      return {
        success: false,
        message: "No active games in this chat."
      };
    }
    
    const groupGames = this.games.get(groupJid);
    
    // Find player's game
    let gameId = null;
    let gameState = null;
    
    for (const [id, game] of groupGames.entries()) {
      if (game.players.includes(playerId)) {
        gameId = id;
        gameState = game;
        break;
      }
    }
    
    // No game found for this player
    if (!gameState) {
      return {
        success: false,
        message: "You're not in an active game."
      };
    }
    
    // Get opponent
    const opponent = gameState.players[0] === playerId ? gameState.players[1] : gameState.players[0];
    
    // End the game
    groupGames.delete(gameId);
    
    // Clear timeout
    if (this.timeouts.has(`${groupJid}:${gameId}`)) {
      clearTimeout(this.timeouts.get(`${groupJid}:${gameId}`));
      this.timeouts.delete(`${groupJid}:${gameId}`);
    }
    
    // Clean up if no more games in group
    if (groupGames.size === 0) {
      this.games.delete(groupJid);
    }
    
    return {
      success: true,
      message: `Game ended by @${playerId.split('@')[0]}. @${opponent.split('@')[0]} wins by forfeit!`,
      opponent
    };
  }
}

// Create a global game manager instance
const tictactoeManager = new TicTacToeManager();



// You need to ensure tictactoeManager is defined and handles createGame, getGameState, makeMove, endGame, formatBoard




// Start Game



gmd({
  pattern: "ttt",
  desc: "Start a TicTacToe game with another user",
  category: "games",
  filename: __filename
}, async (Gifted, mek, m, { sender, isGroup, quoted, reply, from }) => {
  try {
    // Check if user replied to someone
    if (!quoted || !quoted.sender) {
      return reply("❗Please *reply to someone's message* to challenge them to a game.");
    }

    // Prevent playing with self
    if (quoted.sender === sender) {
      return reply("🤨 You cannot play with yourself!");
    }

    // Create game via manager
    const result = tictactoeManager.createGame(from, sender, quoted.sender);
    if (!result.success) return reply(result.message);

    const board = tictactoeManager.formatBoard(result.gameState.board);

    await Gifted.sendMessage(from, {
      text: `🎮 *TIC-TAC-TOE* 🎮\n\n${result.message}\n\n${board}\n\n@${result.gameState.currentPlayer.split('@')[0]}'s turn (❌)\n\nTo make a move, send a number (1-9).`,
      mentions: [sender, quoted.sender]
    });

  } catch (e) {
    console.error("TicTacToe Start Error:", e);
    reply("❌ Error starting the game. Make sure you replied to a user's message.");
  }
});

// End Game

gmd({
  pattern: "ttend",
  desc: "End your current TicTacToe game",
  category: "games",
  filename: __filename
}, async (Gifted, mek, m, { sender, from, reply }) => {
  try {
    const result = tictactoeManager.endGame(from, sender);
    if (!result.success) return reply(result.message);

    // Defensive check for opponent presence
    const mentions = [sender];
    if (result.opponent) mentions.push(result.opponent);

    await Gifted.sendMessage(from, {
      text: result.message,
      mentions
    });

  } catch (e) {
    console.error("TicTacToe End Error:", e);
    reply("❌ Error ending the game. Please try again.");
  }
});

// Handle move inputs 1-9
gmd({
  on: "body"
}, async (Gifted, mek, m, { sender, from, body }) => {
  try {
    if (!/^[1-9]$/.test(body.trim())) return;
    const position = parseInt(body.trim()) - 1;

    const gameInfo = tictactoeManager.getGameState(from, sender);
    if (!gameInfo) return;

    const moveResult = tictactoeManager.makeMove(from, sender, position);
    if (!moveResult.success) {
      return Gifted.sendMessage(from, { text: moveResult.message });
    }

    const formattedBoard = tictactoeManager.formatBoard(moveResult.board);

    // Game result check
    if (moveResult.result) {
      const opponent = gameInfo.gameState.players.find(p => p !== sender);
      if (moveResult.result.status === 'win') {
        return await Gifted.sendMessage(from, {
          text: `🎉 @${sender.split('@')[0]} (${moveResult.result.symbol}) has *won* the game! 🎉\n\n${formattedBoard}`,
          mentions: [sender, opponent]
        });
      } else if (moveResult.result.status === 'draw') {
        return await Gifted.sendMessage(from, {
          text: `🎮 *TIC-TAC-TOE* 🎮\n\n${formattedBoard}\n\n🤝 The game ended in a *draw*! 🤝`,
          mentions: gameInfo.gameState.players
        });
      }
    }

    // Ongoing game — next turn
    const next = moveResult.nextPlayer;
    const nextSymbol = gameInfo.gameState.symbols[next];
    await Gifted.sendMessage(from, {
      text: `🎮 *TIC-TAC-TOE* 🎮\n\n${formattedBoard}\n\n@${next.split('@')[0]}'s turn (${nextSymbol})`,
      mentions: [next]
    });

  } catch (e) {
    console.error("TicTacToe Move Error:", e);
  }
});
//coded by prince tech x gifted 




gmd({
  pattern: "trivia",
  react: '🧠',
  desc: "Start a Trivia Quiz",
  category: "games",
  filename: __filename
},
async (Gifted, mek, m, { from, reply, sender }) => {
  if (activeTrivia[from]) {
    return reply("❗A trivia is already in progress. Please answer it or wait 30s.");
  }

  try {
    const res = await fetchJson("https://opentdb.com/api.php?amount=1&type=multiple");
    const quiz = res.results[0];
    const correct = quiz.correct_answer;
    const options = [...quiz.incorrect_answers, correct].sort(() => Math.random() - 0.5);

    activeTrivia[from] = {
      question: quiz.question,
      correct,
      options,
      user: sender,
      timestamp: Date.now()
    };

    const optionText = options.map((opt, i) => `${i + 1}. ${opt}`).join("\n");

    await Gifted.sendMessage(from, {
      text: `🧠 *Trivia Quiz!*\n\n*${quiz.question}*\n\n${optionText}\n\n_Reply with the option number or correct answer text_`,
    }, { quoted: mek });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (activeTrivia[from] && Date.now() - activeTrivia[from].timestamp >= 30000) {
        Gifted.sendMessage(from, {
          text: `⏰ Time's up! The correct answer was: *${activeTrivia[from].correct}*`
        });
        delete activeTrivia[from];
      }
    }, 30000);
  } catch (e) {
    console.error(e);
    reply("❌ Failed to fetch trivia question.");
  }
});

gmd({
  on: "body"
},
async (Gifted, mek, m, { from, body, pushname, sender }) => {
  const session = activeTrivia[from];
  if (!session || session.user !== sender) return;

  const input = body.trim().toLowerCase();
  const correctText = session.correct.toLowerCase();

  let selectedAnswer = input;

  // If user replied with a number (e.g. 1, 2, 3, 4)
  if (/^[1-4]$/.test(input)) {
    const index = parseInt(input) - 1;
    selectedAnswer = session.options[index]?.toLowerCase() || "";
  }

  if (selectedAnswer === correctText) {
    await Gifted.sendMessage(from, {
      text: `✅ Correct, *${pushname}*! The answer was *${session.correct}*`
    }, { quoted: mek });
  } else {
    await Gifted.sendMessage(from, {
      text: `❌ Wrong answer!\n✅ The correct answer is: *${session.correct}*`
    }, { quoted: mek });
  }

  delete activeTrivia[from];
});




gmd({
  pattern: "guessword",
  react: '🎮',
  desc: "Start a 'Guess the Word' game",
  category: "games",
  filename: __filename
},
async (Gifted, mek, m, {
  from, reply, pushname
}) => {
  if (activeGames[from]) {
    return reply("❗A game is already in progress. Reply with the correct word or wait for it to end.");
  }

  const original = words[Math.floor(Math.random() * words.length)];
  const scrambled = shuffleWord(original);

  activeGames[from] = {
    word: original,
    timestamp: Date.now()
  };

  await Gifted.sendMessage(from, {
    text: `🔤 *Guess the word!*\n\n*${scrambled}*`
  }, { quoted: mek });

  // Timeout the game after 30 seconds
  setTimeout(() => {
    if (activeGames[from] && Date.now() - activeGames[from].timestamp >= 30000) {
      Gifted.sendMessage(from, {
        text: `⏰ Time's up! The correct word was *${activeGames[from].word}*`
      });
      delete activeGames[from];
    }
  }, 30000);
});

// Listener to catch answers (inside gifted system structure)
gmd({
  on: "body"
},
async (Gifted, mek, m, {
  from, body, pushname, reply
}) => {
  if (!activeGames[from]) return;

  const answer = body?.toLowerCase().trim();
  const correct = activeGames[from].word.toLowerCase();

  if (answer === correct) {
    await Gifted.sendMessage(from, {
      text: `✅ Correct, *${pushname}*! The word was *${correct}*`
    }, { quoted: mek });
    delete activeGames[from];
  }
});
