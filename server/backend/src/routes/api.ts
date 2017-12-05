import { interfaces } from 'inversify'
import * as express from 'express'
import { PopularLyricsStorage } from '../services/PopularLyricsStorage'
import { SongSearcher } from '../services/SongSearcher'
import { SongResultNormalizer } from '../services/SongResultNormalizer'
import { WrongSongsSaver } from '../services/WrongSongsSaver'
import { NotFoundSongsSaver } from '../services/NotFoundSongsSaver'
import * as url from 'url'
import { ReportsGenerator } from '../services/ReportsGenerator'

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
                const notFoundSongsSaver = container.get<NotFoundSongsSaver>('notFoundSongsSaver')
                notFoundSongsSaver.saveNotFoundSong(lyrics)
                res.sendStatus(400)
            }
        } else {
            res.sendStatus(400)
        }
    })

    router.post('/songs', (req, res, next) => {
        if (req.query && req.query.lyrics && req.query.title && req.query.artist) {
            const wrongSongsSaver = container.get<WrongSongsSaver>('wrongSongsSaver')
            wrongSongsSaver.saveWrongSong(req.query.lyrics, req.query.artist, req.query.title)
            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }

    })

    router.get('/report/songs/wrong',async (req, res, next) => {
        const currentDate = new Date()
        const from = req.query && req.query.from ? req.query.from : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const to = req.query && req.query.to ? req.query.to : Date.now()
        const reportsGenerator = container.get<ReportsGenerator>('reportsGenerator')
        const reportData = await reportsGenerator.getWrongSongs(from, to)

        res.setHeader('Content-Type', 'application/json')
        res.send(reportData)
    })

    router.get('/report/songs/not-found',async (req, res, next) => {
        const currentDate = new Date()
        const from = req.query && req.query.from ? req.query.from : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime();
        const to = req.query && req.query.to ? req.query.to : Date.now()
        const reportsGenerator = container.get<ReportsGenerator>('reportsGenerator')
        const reportData = await reportsGenerator.getNotFoundSongs(from, to)

        res.setHeader('Content-Type', 'application/json')
        res.send(reportData)
    })

    return router
}