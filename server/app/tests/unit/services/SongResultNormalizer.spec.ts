import 'reflect-metadata'
import { expect } from 'chai'
import { SongResultNormalizer } from '../../../src/services/SongResultNormalizer'
import * as sinon from 'sinon'

describe('Unit: SongResultNormalizer', () => {
    const specialCharsRemoverMock: any = {
        removeSpecialChars: (string => string)
    }

    it('should normalize song data when searched lyrics are in the beginning', async () => {
        const songResultNormalizer = new SongResultNormalizer(specialCharsRemoverMock)
        const songResultArray =
        [{
            title:"Test title",
            artist:"Test artist",
            lyrics: [
                {
                    note: ":",
                    position: 10,
                    text: "Hap"
                },
                {
                    note: ":",
                    position: 12,
                    text: "py"
                },
                {
                    note: "-",
                    position: 13
                },
                {
                    note: ":",
                    position: 12,
                    text: "py"
                },
                {
                    note: ":",
                    position: 14,
                    text: " birth"
                },
                {
                    note: ":",
                    position: 16,
                    text: "day"
                }
            ]
        }]
        const lyrics = 'Hap'
        const normalizedData = JSON.parse(songResultNormalizer.normalizeResult(songResultArray, lyrics))
        expect(normalizedData[0].title).to.be.equal('Test title')
        expect(normalizedData[0].artist).to.be.equal('Test artist')
        expect(normalizedData[0].firstSyllablePosition).to.be.equal(10)
        expect(normalizedData[0].lyrics[2].position).to.be.equal(13)
    })

    it('should normalize song data when searched lyrics are not in the beginning', async () => {
        const songResultNormalizer = new SongResultNormalizer(specialCharsRemoverMock)
        const songResultArray = [
        {
            title:"Test title",
            artist:"Test artist",
            lyrics: [
                {
                    note: ":",
                    position: 10,
                    text: "Mer"
                },
                {
                    note: ":",
                    position: 12,
                    text: "ry"
                },
                {
                    note: "-",
                    position: 13
                },
                {
                    note: ":",
                    position: 12,
                    text: "christ"
                },
                {
                    note: ":",
                    position: 14,
                    text: "mas"
                }
            ]
        }]
        const lyrics = 'christmas'
        const normalizedData = JSON.parse(songResultNormalizer.normalizeResult(songResultArray, lyrics))
        expect(normalizedData[0].title).to.be.equal('Test title')
        expect(normalizedData[0].artist).to.be.equal('Test artist')
        expect(normalizedData[0].firstSyllablePosition).to.be.equal(12)
        expect(normalizedData[0].lyrics[4].text).to.be.equal('mas')
    })

    it('should normalize song data when there are multiple songs found', async () => {
        const songResultNormalizer = new SongResultNormalizer(specialCharsRemoverMock)
        const songResultArray = [
        {
            title:"Test title",
            artist:"Test artist",
            lyrics: [
                {
                    note: ":",
                    position: 10,
                    text: "Mer"
                },
                {
                    note: ":",
                    position: 12,
                    text: "ry"
                },
                {
                    note: "-",
                    position: 13
                },
                {
                    note: ":",
                    position: 12,
                    text: "christ"
                },
                {
                    note: ":",
                    position: 14,
                    text: "mas"
                }
            ]
        },
        {
            title:"Test title 2",
            artist:"Test artist 2",
            lyrics: [
                {
                    note: ":",
                    position: 10,
                    text: "Mer"
                },
                {
                    note: ":",
                    position: 12,
                    text: "ry"
                },
                {
                    note: "-",
                    position: 13
                },
                {
                    note: ":",
                    position: 12,
                    text: "christ"
                },
                {
                    note: ":",
                    position: 14,
                    text: "mas"
                }
            ]
        }]
        const lyrics = 'christmas'
        const normalizedData = JSON.parse(songResultNormalizer.normalizeResult(songResultArray, lyrics))
        expect(normalizedData[0].title).to.be.equal('Test title')
        expect(normalizedData[0].artist).to.be.equal('Test artist')
        expect(normalizedData[0].firstSyllablePosition).to.be.equal(12)
        expect(normalizedData[0].lyrics[4].text).to.be.equal('mas')
        expect(normalizedData[1].title).to.be.equal('Test title 2')
        expect(normalizedData[1].artist).to.be.equal('Test artist 2')
        expect(normalizedData[1].firstSyllablePosition).to.be.equal(12)
        expect(normalizedData[1].lyrics[4].text).to.be.equal('mas')
    })
})