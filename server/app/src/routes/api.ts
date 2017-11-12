import { interfaces } from 'inversify'
import * as express from 'express'
import { PopularLyricsStorage } from '../services/PopularLyricsStorage'
import { SongSearcher } from '../services/SongSearcher'

import * as url from 'url'

export function apiRouter({ container }: interfaces.Context) {
    const router = express.Router()

    router.get('/songs', async (req, res, next) => {
        if (!req.query || !req.query.lyrics) {
            res.send(400)
        }
        const lyrics = req.query.lyrics
        const popularLyricsStorage = container.get<PopularLyricsStorage>('popularLyricsStorage')
        const songSearcher = container.get<SongSearcher>('songSearcher')

        let songData = await popularLyricsStorage.getSongData(lyrics) || undefined

        if (!songData) {
            songData = await songSearcher.findByLyrics(lyrics)
            if (songData) {
                popularLyricsStorage.saveSongData(lyrics, songData)
            }
        }

        if (!songData) {
            res.status(400).send()
        }

        res.setHeader('Content-Type', 'application/json')
        res.send(songData)
    })

    return router
}