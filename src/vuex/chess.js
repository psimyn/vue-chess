export function notationToIndex(notation) {
  const file = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(notation[0])
  const rank = Number(notation[1])
  return 8 * (rank - 1) + file
}

export function moveAsPGNFromSquares(fromSquare, toSquare) {
  if (!fromSquare || !toSquare) throw 'need 2 locations'
  if (!fromSquare.piece) throw 'no piece selected on fromSquare'
  let move = fromSquare.piece.notation || ''
  move = move + toSquare.file + toSquare.rank
  return move
}
