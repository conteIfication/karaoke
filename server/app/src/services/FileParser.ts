import * as Redis from 'redis'
import * as fs from 'fs'
import { Song, Syllable } from '../models/Song'
import { injectable } from 'inversify'
import SpecialCharsRemover from './SpecialCharsRemover'

@injectable()
export class FileParser {

    private specialCharsRemover: SpecialCharsRemover

    constructor(specialCharsRemover: SpecialCharsRemover) {
        this.specialCharsRemover = specialCharsRemover
    }

    private countPolishCharts(lyrics): number {
        let counts = 0
        for (let char of lyrics) {
            if (char == 'ą' || char == 'ę' || char == 'ó' || char == 'ż' || char == 'ź' || char == 'ć' || char == 'ń' || char == 'ł' || char == 'ś') {
                counts++
            } else if (char === '' || char === 'š') {
                counts--
            }
        }

        return counts
    }

    private decode(content) {
        let iconv = require('iconv-lite')
        let bufferIso = iconv.decode(content, 'iso-8859-2')
        let bufferWin1251 = iconv.decode(content, 'win1251')
        let bufferWin1250 = iconv.decode(content, 'win1250')

        let lyricsIso: string = bufferIso.toString('utf8')
        let lyricsWin1251: string = bufferWin1251.toString('utf8')
        let lyricsWin1250: string = bufferWin1250.toString('utf8')

        if (this.countPolishCharts(lyricsWin1250) > this.countPolishCharts(lyricsWin1251)) {
            return this.countPolishCharts(lyricsIso) > this.countPolishCharts(lyricsWin1250) ? lyricsIso : lyricsWin1250
        } else {
            return this.countPolishCharts(lyricsIso) > this.countPolishCharts(lyricsWin1251) ? lyricsIso : lyricsWin1251
        }
    }
    public parseFile(filename: string): Song {
        let song: Song = {
            lyrics: []
        }
        const data = fs.readFileSync(__dirname + '/../../' + filename)
        const rows = this.decode(data).split("\r\n");

        song.fullText =''

        for (let row of rows) {
            if (row.charAt(0) === '#') {
                if (row.startsWith('#TITLE')) {
                    song.title = row.split(':')[1]
                } else if (row.startsWith('#ARTIST')) {
                    song.artist = row.split(':')[1]
                } else if (row.startsWith('#CREATOR')) {
                    song.creator = row.split(':')[1]
                } else if (row.startsWith('#GENRE')) {
                    song.genre = row.split(':')[1]
                } else if (row.startsWith('#LANGUAGE')) {
                    song.language = row.split(':')[1]
                } else if (row.startsWith('#BPM')) {
                    song.bpm = parseFloat(row.split(':')[1].replace(',', '.'))
                } else if (row.startsWith('#GAP')) {
                    song.gap = parseFloat(row.split(':')[1].replace(',', '.'))
                }
            } else if (row.charAt(0) === 'E') {
                break
            } else {
                let syllableData = row.split(' ')
                let syllable: Syllable = {
                    note: syllableData[0],
                    position: Number.parseInt(syllableData[1])
                }
                if (syllable.note !== '-') {
                    syllable.length = Number.parseInt(syllableData[2])
                    syllable.pitch = Number.parseInt(syllableData[3])
                    syllable.text = syllableData[4] !== '' ? syllableData[4] : `${syllableData[4]}${syllableData[5]}`
                    song.fullText += this.specialCharsRemover.removeSpecialChars(syllable.text)
                }
                song.lyrics.push(syllable)
            }
        }

        return song
    }

}