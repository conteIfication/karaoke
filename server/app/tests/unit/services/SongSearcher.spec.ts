import 'reflect-metadata'
import { expect } from 'chai'
import { SongSearcher } from '../../../src/services/SongSearcher'
import * as sinon from 'sinon'

describe('Unit: Song searcher', () => {

    it('should return a song when it is present in Elasticsearch', async () => {
        const elasticsearchResult = Promise.resolve({
            took: 33,
            timed_out: false,
            _shards: {
                total: 5,
                successful: 5,
                skipped: 0,
                failed: 0
            },
            hits: {
                total: 1,
                max_score: 1.0,
                hits: [
                    {
                        _index: "karaoke",
                        _type: "songs",
                        _id: "AV-yrfQyA-np_2MmgjEw",
                        _score: 1.0,
                        _source: {
                            lyrics: [
                                { "note": ":", "position": 0, "length": 3, "pitch": 3, "text": "OK" }
                            ],
                            title: "Test title",
                            artist: "Test artist",
                        }
                    }
                ]
            }
        })

        const elasticsearchMock: any = {
            search: sinon.mock().returns(elasticsearchResult)
        }
        const songSearcher = new SongSearcher(elasticsearchMock)
        const song = await songSearcher.findByLyrics('testlyrics')

        expect(elasticsearchMock.search.calledWith({
            index: 'karaoke',
            type: 'songs',
            body: {
              query: {
                wildcard: {
                  fullText: {
                    value: `*testlyrics*`
                  }
                }
              },
            }
        })).to.be.true
        expect(song).to.be.equal('{"lyrics":[{"note":":","position":0,"length":3,"pitch":3,"text":"OK"}],"title":"Test title","artist":"Test artist"}')
    })

    it('should return null when the song has not been found', async () => {
        const elasticsearchResult = Promise.resolve({
            took: 33,
            timed_out: false,
            _shards: {
                total: 5,
                successful: 5,
                skipped: 0,
                failed: 0
            },
            hits: {
                total: 0,
                max_score: null,
                hits: []
            }
        })
        const elasticsearchMock: any = {
            search: sinon.mock().returns(elasticsearchResult)
        }
        const songSearcher = new SongSearcher(elasticsearchMock)
        const song = await songSearcher.findByLyrics('testlyrics2')

        expect(elasticsearchMock.search.calledWith({
            index: 'karaoke',
            type: 'songs',
            body: {
              query: {
                wildcard: {
                  fullText: {
                    value: `*testlyrics2*`
                  }
                }
              },
            }
        })).to.be.true
        expect(song).to.be.equal(null)
    })
})