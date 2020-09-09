import env from '../env/env'
import { call } from './api'

const get = (offset) => {

    return call('GET', `${env.api_domain}/news?offset=${offset || 0}`)
        .then(resp => {
            return resp
        }).catch(err => {
            throw err
        })
}

export { get }
