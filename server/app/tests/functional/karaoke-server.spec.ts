import * as request from 'supertest'
import { expect } from 'chai'
import * as express from 'express'
import * as supertest from 'supertest'
import { FileParser } from '../../src/services/FileParser'
import * as Elasticsearch from 'elasticsearch'
import container from '../../src/app'

describe('Functional: karaoke server endpoint', () => {

    describe('when lyrics have not been given', () => {
        it('should return 400', (done) => {
          request(container.get<express.Application>('app'))
            .get('/songs')
            .set('Accept', 'application/json')
            .expect(400, done)
        })
      })

    describe('when lyrics have been given', async () => {

        const fileParser = container.get<FileParser>('fileParser')
        const song = await fileParser.parseFile('../tests/lyrics/test.txt')
        const elasticsearch = container.get<Elasticsearch.Client>('elasticsearch')
        elasticsearch.index({
            index: 'karaoke',
            type: 'songs',
            body: song
        }, (err, resp) => {
        })

        it('should return 204 when there is no song available', (done) => {
          request(container.get<express.Application>('app'))
            .get('/songs?lyrics=Happybirthday')
            .set('Accept', 'application/json')
            .expect(204, done)
        })

        it('should return song with correct lyrics when the song has been found 1/2', (done) => {
            request(container.get<express.Application>('app'))
              .get('/songs?lyrics=wodzicka')
              .set('Accept', 'application/json')
              .expect(200, done)
        })

        it('should return song with correct lyrics when the song has been found 2/2', (done) => {
            request(container.get<express.Application>('app'))
              .get('/songs?lyrics=lesieciemny')
              .set('Accept', 'application/json')
              .expect(200, done)
        })
        it('should return song with correct lyrics when the song has been found for lyrics with spaces', (done) => {
            request(container.get<express.Application>('app'))
              .get('/songs?lyrics=bystra%20woda')
              .set('Accept', 'application/json')
              .expect(200, done)
        })
      })
})