// tictactoe.js (Full-in-One Game File) 
const { gmd } = require('../gift');

// Utils 
function normalizeJid(jid) { return jid?.split(':')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'; }

// Game State Manager
class TicTacToeManager { constructor() { this.games = new Map(); this.timeouts = new Map(); this.gameTimeout = 5 * 60 * 1000; }

createGame(chatId, player1, player2) { const gameId = ${player1}:${player2}; if (!this.games.has(chatId)) this.games.set(chatId, new Map());

const groupGames = this.games.get(chatId);
for (const [, game] of groupGames) {
  if (game.players.includes(player1) || game.players.includes(player2)) {
    return { success: false, message: `One of the players is already in a game.` };
  }
}

const gameState = {
  players: [player1, player2],
  board: Array(9).fill(null),
  currentPlayer: player1,
  symbols: { [player1]: '❌', [player2]: '⭕' },
  startTime: Date.now(),
  lastMoveTime: Date.now()
};

groupGames.set(gameId, gameState);
this.setGameTimeout(chatId, gameId);

return {
  success: true,
  message: `Game created between @${player1.split('@')[0]} (❌) and @${player2.split('@')[0]} (⭕)`,
  gameId,
  gameState
};

}

makeMove(chatId, player, pos) { if (!this.games.has(chatId)) return { success: false, message: No active games in this chat. };

const groupGames = this.games.get(chatId);
let gameId = null, gameState = null;

for (const [id, game] of groupGames) {
  if (game.players.includes(player)) {
    gameId = id;
    gameState = game;
    break;
  }
}

if (!gameState) return { success: false, message: `You're not in an active game.` };
if (gameState.currentPlayer !== player) return { success: false, message: `It's not your turn!` };
if (pos < 0 || pos > 8 || !Number.isInteger(pos)) return { success: false, message: `Invalid move! Choose 1-9.` };
if (gameState.board[pos] !== null) return { success: false, message: `Cell already filled! Choose another.` };

gameState.board[pos] = gameState.symbols[player];
gameState.lastMoveTime = Date.now();
this.setGameTimeout(chatId, gameId);

const winner = this.checkWinner(gameState.board);
let result = null;

if (winner) {
  result = { status: 'win', winner: player, symbol: gameState.symbols[player] };
  groupGames.delete(gameId);
} else if (!gameState.board.includes(null)) {
  result = { status: 'draw' };
  groupGames.delete(gameId);
} else {
  gameState.currentPlayer = gameState.players[0] === player ? gameState.players[1] : gameState.players[0];
}

if (groupGames.size === 0) this.games.delete(chatId);

return {
  success: true,
  board: gameState.board,
  result,
  nextPlayer: gameState.currentPlayer
};

}

getGameState(chatId, playerId) { if (!this.games.has(chatId)) return null; const groupGames = this.games.get(chatId); for (const [id, game] of groupGames) { if (game.players.includes(playerId)) return { gameId: id, gameState: game }; } return null; }

formatBoard(board) { const h = '┄┄┄┄┄┄┄┄┄┄┄'; const v = '┃'; const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']; let out = ${h}\n; for (let i = 0; i < 3; i++) { let row = ${v} ; for (let j = 0; j < 3; j++) { const p = i * 3 + j; row += ${board[p] || nums[p]} ; if (j < 2) row += ${v} ; } out += ${row}${v}\n; if (i < 2) out += ${h}\n; } return out + h; }

checkWinner(b) { const win = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; for (const [a,b_,c] of win) { if (b[a] && b[a] === b[b_] && b[a] === b[c]) return b[a]; } return null; }

endGame(chatId, player) { if (!this.games.has(chatId)) return { success: false, message: "No active games in this chat." }; const groupGames = this.games.get(chatId); for (const [id, game] of groupGames.entries()) { if (game.players.includes(player)) { const opponent = game.players.find(p => p !== player); groupGames.delete(id); if (groupGames.size === 0) this.games.delete(chatId); return { success: true, message: Game ended by @${player.split('@')[0]}. @${opponent.split('@')[0]} wins by forfeit!, opponent }; } } return { success: false, message: "You're not in an active game." }; }

setGameTimeout(chatId, gameId) { const key = ${chatId}:${gameId}; if (this.timeouts.has(key)) clearTimeout(this.timeouts.get(key)); const id = setTimeout(() => { if (this.games.has(chatId)) { const groupGames = this.games.get(chatId); groupGames.delete(gameId); if (groupGames.size === 0) this.games.delete(chatId); } this.timeouts.delete(key); }, this.gameTimeout); this.timeouts.set(key, id); } }

const tictactoeManager = new TicTacToeManager();

// Start Game 
gmd({ pattern: "ttt", desc: "Start TicTacToe", category: "games" }, async (Gifted, mek, m, { sender, quoted, reply, from, isGroup }) => { if (!isGroup) return reply("TicTacToe works only in groups."); if (!quoted?.sender) return reply("Reply to someone's message to play."); const p1 = normalizeJid(sender); const p2 = normalizeJid(quoted.sender); if (p1 === p2) return reply("You cannot play with yourself."); const game = tictactoeManager.createGame(from, p1, p2); if (!game.success) return reply(game.message); const board = tictactoeManager.formatBoard(game.gameState.board); await Gifted.sendMessage(from, { text: 🎮 *TIC-TAC-TOE* 🎮\n\n${game.message}\n\n${board}\n\n@${game.gameState.currentPlayer.split('@')[0]}'s turn (❌)\nTo play, send number 1-9., mentions: game.gameState.players }); });

// End Game 
  gmd({ pattern: "ttend", desc: "End TicTacToe", category: "games" }, async (Gifted, mek, m, { sender, from, reply }) => { const player = normalizeJid(sender); const res = tictactoeManager.endGame(from, player); if (!res.success) return reply(res.message); await Gifted.sendMessage(from, { text: res.message, mentions: [player, res.opponent] }); });

// Handle Move 
                    gmd({ on: "body" }, async (Gifted, mek, m, { sender, from, body }) => { if (!/^[1-9]$/.test(body.trim())) return; const pos = parseInt(body.trim()) - 1; const player = normalizeJid(sender); const game = tictactoeManager.getGameState(from, player); if (!game) return; const move = tictactoeManager.makeMove(from, player, pos); if (!move.success) return Gifted.sendMessage(from, { text: move.message }); const board = tictactoeManager.formatBoard(move.board); if (move.result) { if (move.result.status === 'win') { await Gifted.sendMessage(from, { text: 🎉 @${player.split('@')[0]} (${move.result.symbol}) won! 🎉, mentions: [player, ...game.gameState.players.filter(p => p !== player)] }); } else if (move.result.status === 'draw') { await Gifted.sendMessage(from, { text: 🤝 It's a draw! 🤝\n\n${board}, mentions: game.gameState.players }); } } else { const symbol = game.gameState.symbols[move.nextPlayer]; await Gifted.sendMessage(from, { text: 🎮 *TIC-TAC-TOE* 🎮\n\n${board}\n\n@${move.nextPlayer.split('@')[0]}'s turn (${symbol}), mentions: [move.nextPlayer] }); } });


