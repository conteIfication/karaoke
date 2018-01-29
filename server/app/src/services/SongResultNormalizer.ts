import { injectable } from 'inversify'
import { SongResult, Syllable } from '../models/Song'
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

    public normalizeResult(songDataArray: SongResult[], lyrics: string): string {
        let normalizedArray = []

        for (let song of songDataArray) {
            let normalizedSongObject = {
                title: song.title,
                artist: song.artist,
                creator: song.creator,
                genre: song.genre,
                language: song.language,
                bpm: song.bpm,
                lyrics: song.lyrics,
                firstSyllablePosition: this.findLyricsGap(lyrics, song.lyrics)
            }

            normalizedArray.push(normalizedSongObject)
        }

        return JSON.stringify(normalizedArray)

    }

}