export interface SongResult {
  title?: string
  artist?: string
  language?: string
  genre?: string
  creator?: string
  bpm?: number
  gap?: number
  lyrics?: Syllable[]
  fullText?: string,
  firstSyllablePosition?: number
}

export interface Syllable {
  note: string
  position: number
  length?: number
  pitch?: number
  text?: string
}
