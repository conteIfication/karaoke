import 'reflect-metadata'
import * as sinon from 'sinon'
import { expect } from 'chai'
import { FileParser } from '../../../src/services/FileParser'

describe('Unit: FileParser', () => {
  it('should parse song correctly', async () => {
    const specialCharsRemoverMock: any = {
      removeSpecialChars: (string => string)
    }

    const fileParser = new FileParser(specialCharsRemoverMock)
    const song = await fileParser.parseFile('tests/lyrics/test.txt')

    expect(song.title).to.be.equal('Hej, Bystra Woda')
    expect(song.artist).to.be.equal('Ludowe')
    expect(song.language).to.be.equal('Polish')
    expect(song.genre).to.be.equal('Pop')
    expect(song.bpm).to.be.equal(135.52)
    expect(song.gap).to.be.equal(17840)
    expect(song.fullText).to.contain('Hej, bystra woda, bystra wodzicka')
    expect(JSON.stringify(song.lyrics[0])).to.be.equal(JSON.stringify({ note: ':', position: 0, length: 1, pitch: 9, text: 'Hej,' }))
    expect(JSON.stringify(song.lyrics[10])).to.be.equal(JSON.stringify({ note: '-', position: 31 }))
    expect(JSON.stringify(song.lyrics[13])).to.be.equal(JSON.stringify({ note: ':', position: 39, length: 1, pitch: 9, text: 'ło' }))
  })
})
