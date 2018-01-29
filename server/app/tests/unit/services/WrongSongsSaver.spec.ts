import 'reflect-metadata'
import { expect } from 'chai'
import { WrongSongsSaver } from '../../../src/services/WrongSongsSaver'
import * as sinon from 'sinon'

describe('Unit: Wrong songs saver', () => {

    it('should save wrong song in Elasticsearch', async () => {
        const elasticsearchMock: any = {
            index: sinon.mock()
        }

        let clock = sinon.useFakeTimers(new Date(2016,2,15).getTime())

        const wrongSongsSaver = new WrongSongsSaver(elasticsearchMock)
        await wrongSongsSaver.saveWrongSong('lyrics', 'artist', 'title')

        expect(elasticsearchMock.index.calledWith({
            index: 'karaoke',
            type: 'wrong-songs',
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