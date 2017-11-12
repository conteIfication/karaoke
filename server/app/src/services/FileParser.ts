import * as Redis from 'redis'
import * as fs from 'fs'
import { Song, Syllable } from '../models/Song'
import { injectable } from 'inversify'

@injectable()
export default class FileParser {

    private decode(content) {
        let iconv = require('iconv-lite')
        let buffer = iconv.decode(content, 'iso-8859-2')

        return buffer.toString('utf8')
    }
    public parseFile(filename: string): Song {
        let song: Song = {
            lyrics: []
        }
        const data = fs.readFileSync(__dirname + '/../../lyrics/' + filename)
        const rows = this.decode(data).split("\r\n");

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
                    syllable.text = syllableData[syllableData.length - 1] !== '' ? syllableData[syllableData.length - 1] : syllableData[syllableData.length - 2]
                }
                song.lyrics.push(syllable)
            }
        }

        return song
    }

}