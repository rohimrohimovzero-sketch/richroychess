const game = new Chess();

const pieces = document.querySelectorAll(".white, .black");

const boardMap = [
"a8","b8","c8","d8","e8","f8","g8","h8",
"a7","b7","c7","d7","e7","f7","g7","h7",
"a6","b6","c6","d6","e6","f6","g6","h6",
"a5","b5","c5","d5","e5","f5","g5","h5",
"a4","b4","c4","d4","e4","f4","g4","h4",
"a3","b3","c3","d3","e3","f3","g3","h3",
"a2","b2","c2","d2","e2","f2","g2","h2",
"a1","b1","c1","d1","e1","f1","g1","h1"
];

let selectedSquare = null;

pieces.forEach((piece, index) => {

piece.setAttribute("data-square", boardMap[index]);

piece.addEventListener("click", () => {

let square = piece.dataset.square;

if(selectedSquare === null){

if(piece.innerHTML !== ""){
selectedSquare = square;
}

return;

}

let move = game.move({
from: selectedSquare,
to: square,
promotion: "q"
});
if(move === null){
    console.log(move);
    selectedSquare = null;
    return;
}
if(move){
  renderBoard();
  worker.postMessage("position fen " + game.fen());
worker.postMessage("go depth 10");
selectedSquare = null;

}

});

});
let worker;
const stockfishUrl = "https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js";

fetch(stockfishUrl)
  .then(res => res.text())
  .then(code => {
    const blob = new Blob([code], { type: "application/javascript" });
    worker = new Worker(URL.createObjectURL(blob));

    worker.onmessage = function(e) {
      console.log("Bot:", e.data);
      if(e.data.startsWith("bestmove")){

const move = e.data.split(" ")[1];

game.move({
from: move.substring(0,2),
to: move.substring(2,4),
promotion: "q"
});

renderBoard();

}
      if (e.data === "uciok") {
        console.log("Stockfish tayyor!");
        worker.postMessage("isready");
      }
    };

    worker.postMessage("uci");
    // Motorga yangi o'yin boshlashni aytamiz
    worker.postMessage("ucinewgame");
  })
  .catch(err => console.error("Yuklashda xato:", err));
  function renderBoard(){
pieces.forEach(piece => {
    piece.innerHTML = "";
});
const board = game.board();
console.log(board);
board.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
        if(square){
            const pieceIndex = rowIndex * 8 + colIndex;
            const piece = pieces[pieceIndex];
            piece.innerHTML = getPieceHTML(square);
            piece.setAttribute("data-piece", square.type);
            }
            });
            });
            }

function getPieceHTML(square){

const pieces = {
  wp: "♙",
  wr: "♖",
  wn: "♘",
  wb: "♗",
  wq: "♕",
  wk: "♔",

  bp: "♟",
  br: "♜",
  bn: "♞",
  bb: "♝",
  bq: "♛",
  bk: "♚"
};

const pieceKey = square.color + square.type;

return pieces[pieceKey];

}
        