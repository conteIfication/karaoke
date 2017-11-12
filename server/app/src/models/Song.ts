export interface Song {
  title?: string
  artist?: string
  language?: string
  genre?: string
  creator?: string
  bpm?: number
  gap?: number
  lyrics?: Syllable[]
}

export interface Syllable {
  note: string
  position: number
  length?: number
  pitch?: number
  text?: string
}
