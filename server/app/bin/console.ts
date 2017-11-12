import * as program from 'commander'
import container from '../src/app'
import * as express from 'express'
import FileParser from '../src/services/FileParser'

const app = container.get<express.Application>('app')
const elasticsearch = container.get<Elasticsearch.Client>('elasticsearch')


program
    .version(require('../package.json').version)

program
    .command('create:index')
    .alias('c:i')
    .description('Create index in database')
    .action(() => {
        elasticsearch.indices.create({
            index: 'karaoke'
        }, (err, resp, status) => {
            if (err) {
                console.log(err)
            } else {
                console.log('create', resp)
            }
        })
    })

program
    .command('add:song')
    .alias('a:s')
    .description('Add song to database')
    .action(async (filename) => {
        const fileParser = container.get<FileParser>('fileParser')
        const song = await fileParser.parseFile(filename)
        elasticsearch.index({
            index: 'karaoke',
            type: 'songs',
            body: song
        }, (err, resp) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`Added ${filename} ${JSON.stringify(song.lyrics[song.lyrics.length - 1])}`)
            }
        })
    })


program.parse(process.argv)