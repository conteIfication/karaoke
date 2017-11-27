import { interfaces } from 'inversify'
import * as express from 'express'
import { PopularLyricsStorage } from '../services/PopularLyricsStorage'
import { SongSearcher } from '../services/SongSearcher'
import { SongResultNormalizer } from '../services/SongResultNormalizer'

import * as url from 'url'

export function apiRouter({ container }: interfaces.Context) {
    const router = express.Router()

    router.get('/songs', async (req, res, next) => {
        if (req.query && req.query.lyrics) {
            const lyrics = req.query.lyrics.replace(/ /g, '').replace(/%20/g, '')
            const popularLyricsStorage = container.get<PopularLyricsStorage>('popularLyricsStorage')
            const songSearcher = container.get<SongSearcher>('songSearcher')
            const songResultNormalizer = container.get<SongResultNormalizer>('songResultNormalizer')

            let songData = await popularLyricsStorage.getSongData(lyrics) || undefined

            if (!songData) {
                songData = songResultNormalizer.normalizeResult(await songSearcher.findByLyrics(lyrics), lyrics)
            }

            if (songData) {
                popularLyricsStorage.saveSongData(lyrics, songResultNormalizer.normalizeResult(songData, lyrics))
                res.setHeader('Content-Type', 'application/json')
                res.send(songData)
            } else {
                res.sendStatus(400)
            }
        } else {
            res.sendStatus(400)
        }
    })

    return router
}