import 'reflect-metadata'
import { expect } from 'chai'
import { FoundSongsSaver } from '../../../src/services/FoundSongsSaver'
import * as sinon from 'sinon'

describe('Unit: Found songs saver', () => {

    it('should save found song in Elasticsearch', async () => {
        const elasticsearchMock: any = {
            index: sinon.mock()
        }

        let clock = sinon.useFakeTimers(new Date(2016,2,15).getTime())

        const foundSongsSaver = new FoundSongsSaver(elasticsearchMock)
        await foundSongsSaver.saveFoundSong('lyrics', 'artist', 'title')

        expect(elasticsearchMock.index.calledWith({
            index: 'karaoke',
            type: 'found-songs',
            body: {
                searchedLyrics: 'lyrics',
                artist: 'artist',
                title: 'title',
                date: Date.now()
            }
        })).to.be.true

        clock.restore()
    })
})