import { expect } from 'chai'
import { notationToIndex, moveAsPGNFromSquares } from './chess'

describe('notation lookups', () => {
  it('gives correct index', () => {
    expect(notationToIndex('a1')).to.equal(0)
    expect(notationToIndex('c2')).to.equal(10)
    expect(notationToIndex('c3')).to.equal(18)
    expect(notationToIndex('d2')).to.equal(11)
    expect(notationToIndex('e2')).to.equal(12)
    expect(notationToIndex('h8')).to.equal(63)
  })
})

describe('moveAsPGNFromSquares', () => {
  it('needs both fromSquare and toSquare', () => {
    expect(moveAsPGNFromSquares.bind()).to.throw('need 2 locations')
    expect(moveAsPGNFromSquares.bind('a1')).to.throw('need 2 locations')
    expect(moveAsPGNFromSquares.bind(null, 'a1')).to.throw('need 2 locations')
  })

  it('returns move for pawn', () => {
    const fromSquare = {piece: {}}
    const toSquare = {file: 'c', rank: '3'}
    expect(moveAsPGNFromSquares(fromSquare, toSquare)).to.equal('c3')
  })

  it('returns move for Queen', () => {
    const fromSquare = {piece: {notation: 'Q'}}
    const toSquare = {file: 'c', rank: '3'}
    expect(moveAsPGNFromSquares(fromSquare, toSquare)).to.equal('Qc3')
  })


})
