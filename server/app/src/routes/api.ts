import { interfaces } from 'inversify'
import * as express from 'express'
import { PopularLyricsStorage } from '../services/PopularLyricsStorage'
import { SongSearcher } from '../services/SongSearcher'
import { SongResultNormalizer } from '../services/SongResultNormalizer'
import { WrongSongsSaver } from '../services/WrongSongsSaver'
import { NotFoundSongsSaver } from '../services/NotFoundSongsSaver'
import { FoundSongsSaver } from '../services/FoundSongsSaver'
import * as url from 'url'
import * as PassportModule from 'passport'
import { ReportsGenerator } from '../services/ReportsGenerator'

export function apiRouter({ container }: interfaces.Context) {
    const router = express.Router()
    const passport = container.get<any>('passport')

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

            if (songData !== '[]') {
                const songDataObject = JSON.parse(songData)
                const foundSongsSaver = container.get<FoundSongsSaver>('foundSongsSaver')
                for (let song of songDataObject) {
                    foundSongsSaver.saveFoundSong(req.query.lyrics, song.artist, song.title)
                }
                popularLyricsStorage.saveSongData(lyrics, songResultNormalizer.normalizeResult(songDataObject, lyrics))
                res.setHeader('Content-Type', 'application/json')
                res.send(JSON.stringify(songDataObject))
            } else {
                const notFoundSongsSaver = container.get<NotFoundSongsSaver>('notFoundSongsSaver')
                notFoundSongsSaver.saveNotFoundSong(req.query.lyrics)
                res.sendStatus(400)
            }
        } else {
            res.sendStatus(400)
        }
    })

    router.all('/incorrect_lyrics', (req, res, next) => {
        if (req.query && req.query.lyrics && req.query.title && req.query.artist) {
            const wrongSongsSaver = container.get<WrongSongsSaver>('wrongSongsSaver')
            wrongSongsSaver.saveWrongSong(req.query.lyrics, req.query.artist, req.query.title)
            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }

    })

    router.get('/incorrectly', isLoggedIn, async (req, res, next) => {
        const reportsGenerator = container.get<ReportsGenerator>('reportsGenerator')
        const incorrectlyRecognized = await reportsGenerator.getWrongSongs()

        res.render('incorrectly.ejs', { incorrectlyRecognized })
    })

    router.get('/notrecognized', isLoggedIn, async (req, res, next) => {
        const reportsGenerator = container.get<ReportsGenerator>('reportsGenerator')
        const notRecognized = await reportsGenerator.getNotFoundSongs()

        res.render('notrecognized.ejs', { notRecognized })
    })

    router.get('/recognized', isLoggedIn, async (req, res, next) => {
        const reportsGenerator = container.get<ReportsGenerator>('reportsGenerator')
        const recognized = await reportsGenerator.getFoundSongs()

        res.render('recognized.ejs', { recognized })
    })

    router.get('/', (req: any, res) => {
        res.render('login.ejs', { message: req.flash('loginMessage') })
    })

    router.post('/', passport.authenticate('local-login',
    {
        successRedirect: '/recognized',
        failureRedirect: '/',
        failureFlash: true,
    }))

    router.get('/logoff', (req, res) => {
        req.logout()
        res.redirect('/')
    })

    return router
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
