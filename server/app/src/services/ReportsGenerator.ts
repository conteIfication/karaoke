import * as Elasticsearch from 'elasticsearch'
import { injectable } from 'inversify'
import { WrongSong } from '../models/WrongSong'
import { NotFoundSong } from '../models/NotFoundSong'
import { FoundSong } from '../models/FoundSong'

@injectable()
export class ReportsGenerator {

    private elasticsearch: Elasticsearch.Client

    constructor(elasticsearch: Elasticsearch.Client) {
        this.elasticsearch = elasticsearch
    }

    public async getWrongSongs(): Promise<WrongSong[]> {
        return this.elasticsearch.search({
            index: 'karaoke',
            type: 'wrong-songs',
            body: {
                sort: {
                    date: {
                        order: "asc"
                    }
                }
            }
        }).then((resp: any) => {
            if (resp.hits.total > 0) {
                return resp.hits.hits.map(hit => {
                    return {
                        lyrics: hit._source.searchedLyrics,
                        title: hit._source.title,
                        artist: hit._source.artist,
                    }
                })
            } else {
                return []
            }
        }, err => {
            return []
        })

    }

    public async getNotFoundSongs(): Promise<NotFoundSong[]> {

        return this.elasticsearch.search({
            index: 'karaoke',
            type: 'not-found-songs',
            body: {
                aggs: {
                    by_lyrics: {
                        terms: {
                            field: 'searchedLyrics.keyword'
                        }
                    }
                }
            }
        }).then((resp: any) => {
            if (resp.aggregations.by_lyrics.buckets.length > 0) {
                return resp.aggregations.by_lyrics.buckets.map(bucket => {
                    return {
                        lyrics: bucket.key,
                        count: bucket.doc_count
                    }
                })
            } else {
                return []
            }
        }, err => {
            return []
        })

    }

    public async getFoundSongs(): Promise<FoundSong[]> {

        return this.elasticsearch.search({
            index: 'karaoke',
            type: 'found-songs',
            body: {
                aggs: {
                    by_lyrics: {
                        terms: {
                            field: 'searchedLyrics.keyword'
                        },
                        aggs: {
                            by_artist: {
                                terms: {
                                    field: 'artist.keyword'
                                },
                                aggs: {
                                    by_title: {
                                        terms: {
                                            field: 'title.keyword'
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            }
        }).then((resp: any) => {
            if (resp.aggregations.by_lyrics.buckets.length > 0) {

                let ar = []
                resp.aggregations.by_lyrics.buckets.map(bucket => {
                    return bucket.by_artist.buckets.map(bucket2 => {
                        return bucket2.by_title.buckets.map(bucket3 => {
                                    ar.push({
                                        lyrics: bucket.key,
                                        artist: bucket2.key,
                                        title: bucket3.key,
                                        count: bucket3.doc_count
                                    })
                                })
                    })
                    
                    
                    // return bucket.by_artist.buckets.map(bucket2 => {
                    //     return bucket2.by_title.buckets.map(bucket3 => {
                    //         return {
                    //             lyrics: bucket.key,
                    //             artist: bucket2.key,
                    //             title: bucket3.key,
                    //             count: bucket3.doc_count
                    //         }
                    //     })
                    // })
                })
                return ar
            } else {
                return []
            }
        }, err => {
            return []
        })

    }
}