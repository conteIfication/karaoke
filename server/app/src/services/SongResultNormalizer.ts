import { injectable } from 'inversify'
import { Song, Syllable } from '../models/Song'
import SpecialCharsRemover from './SpecialCharsRemover'

@injectable()
export class SongResultNormalizer {

    private specialCharsRemover: SpecialCharsRemover

    constructor(specialCharsRemover: SpecialCharsRemover) {
        this.specialCharsRemover = specialCharsRemover
    }

    private findLyricsGap(lyrics: string, songLyrics: Syllable[]): number {
        let lyricsWithoutSpecialChars = this.specialCharsRemover.removeSpecialChars(lyrics)
        let firstPosition = -1
        let commonLyrics = ''
        for (let syllable of songLyrics) {
            if (firstPosition > -1) {
                commonLyrics += this.specialCharsRemover.removeSpecialChars(syllable.text)
            } else if (lyricsWithoutSpecialChars.startsWith(this.specialCharsRemover.removeSpecialChars(syllable.text))) {
                firstPosition = syllable.position
                commonLyrics = this.specialCharsRemover.removeSpecialChars(syllable.text)
            }

            if (commonLyrics === lyricsWithoutSpecialChars) {
                return firstPosition
            } else if(commonLyrics.length >= lyricsWithoutSpecialChars.length) {
                firstPosition = -1
                commonLyrics = ''
            }
        }

        return 0
    }

    public normalizeResult(songDataString: string, lyrics: string): string {
        const song = JSON.parse(songDataString)
        if (!song) return null

        let songObject = {
            title: song.title,
            artist: song.artist,
            creator: song.creator,
            genre: song.genre,
            language: song.language,
            bpm: song.bpm,
            lyrics: song.lyrics,
            firstSyllablePosition: this.findLyricsGap(lyrics, song.lyrics)
        }

        return JSON.stringify(songObject)

    }

}