import 'reflect-metadata'
import { expect } from 'chai'
import { PopularLyricsStorage } from '../../../src/services/PopularLyricsStorage'
import * as sinon from 'sinon'

describe('Unit: Popular lyrics storage', () => {

  it('should get song data from redis', async () => {
    const redisMock: any = {
      get: sinon.mock().callsArgWith(1, null, '{ "title": "testTitle", "artist": "testArtist" }')
    }
    const popularLyricsStorage = new PopularLyricsStorage(redisMock)
    const songData = await popularLyricsStorage.getSongData('this is song text')

    expect(redisMock.get.calledWith('this is song text')).to.be.true
    expect(songData).to.be.equal('{ "title": "testTitle", "artist": "testArtist" }')
  })

  it('should save lyrics with song data in redis', async () => {
    const redisMock: any = {
      set: sinon.mock().callsArgWith(4, null, 'OK')
    }
    const popularLyricsStorage = new PopularLyricsStorage(redisMock)
    const lyrics = 'Test lyrics'
    const songData = '{ "title": "testTitle", "artist": "testArtist" }'
    await popularLyricsStorage.saveSongData(lyrics, songData)

    expect(redisMock.set.calledWith(lyrics, songData, 'EX', 3600 * 24, sinon.match.func)).to.be.true
  })
})