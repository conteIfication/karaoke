import 'reflect-metadata'
import { expect } from 'chai'
import { NotFoundSongsSaver } from '../../../src/services/NotFoundSongsSaver'
import * as sinon from 'sinon'

describe('Unit: Found songs saver', () => {

    it('should save not found song in Elasticsearch', async () => {
        const elasticsearchMock: any = {
            index: sinon.mock()
        }

        let clock = sinon.useFakeTimers(new Date(2016,2,15).getTime())

        const notFoundSongsSaver = new NotFoundSongsSaver(elasticsearchMock)
        await notFoundSongsSaver.saveNotFoundSong('lyrics')

        expect(elasticsearchMock.index.calledWith({
            index: 'karaoke',
            type: 'not-found-songs',
            body: {
                searchedLyrics: 'lyrics',
                date: Date.now()
            }
        })).to.be.true

        clock.restore()
    })
})