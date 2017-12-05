import * as Elasticsearch from 'elasticsearch'
import { injectable } from 'inversify'

@injectable()
export class ReportsGenerator {

    private elasticsearch: Elasticsearch.Client

    constructor(elasticsearch: Elasticsearch.Client) {
        this.elasticsearch = elasticsearch
    }

    public async getWrongSongs(dateFrom: number, dateTo: number): Promise<string> {
        return this.elasticsearch.search({
            index: 'karaoke',
            type: 'wrong-songs',
            body: {
                query: {
                    constant_score: {
                        filter: {
                            range: { date: { from: dateFrom, to: dateTo } }
                        }
                    }
                },
                aggs: {
                    by_lyrics: {
                        terms: {
                            field: 'lyrics.keyword'
                        },
                        aggs: {
                            by_title: {
                                terms: {
                                    field: 'title.keyword'
                                }
                            }
                        }
                    }
                }
            }
        }).then((resp: any) => {
            if (resp.aggregations.by_lyrics.buckets.length > 0) {
                return JSON.stringify(resp.aggregations.by_lyrics.buckets.map(bucket => {
                    return {
                        lyrics: bucket.key,
                        title: bucket.by_title.buckets[0].key,
                        count: bucket.doc_count
                    }
                }))
            } else {
                return null
            }
        }, err => {
            return null
        })

    }

    public async getNotFoundSongs(dateFrom: number, dateTo: number): Promise<string> {

        return this.elasticsearch.search({
            index: 'karaoke',
            type: 'not-found-songs',
            body: {
                query: {
                    constant_score: {
                        filter: {
                            range: { date: { from: dateFrom, to: dateTo } }
                        }
                    }
                },
                aggs: {
                    by_lyrics: {
                        terms: {
                            field: 'lyrics.keyword'
                        }
                    }
                }
            }
        }).then((resp: any) => {
            if (resp.aggregations.by_lyrics.buckets.length > 0) {
                return JSON.stringify(resp.aggregations.by_lyrics.buckets.map(bucket => {
                    return {
                        lyrics: bucket.key,
                        count: bucket.doc_count
                    }
                }))
            } else {
                return null
            }
        }, err => {
            return null
        })

    }
}