import env from '../env/env'
import { call } from './api'

const getAll = () => {

    return call('GET', `${env.api_domain}/coupon`)
        .then(resp => {
            return resp
        }).catch(err => {
            throw err
        })
}

const use = id => {

    return call('PUT', `${env.api_domain}/coupon/use/${id}`)
        .then(resp => {
            return resp
        }).catch(err => {
            throw err
        })
}

export { getAll, use }
