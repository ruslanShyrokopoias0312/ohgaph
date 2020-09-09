import env from '../env/env'
import { call } from './api'

const signin = (card_number, pin_number) => {

    return call('POST', `${env.api_domain}/authenticate`,`card_number=${card_number}&pin_number=${pin_number}`)
        .then(resp => { return resp })
        .catch(err => {
          // 別途処置が必要なエラーコードはここで判定
          // それ以外は「カード番号とPINの組み合わせが正しくありません。」
          if(err.code === 'G61' || err.code === 'G83') {
            throw {message: err.message, status: 400, code: err.code}
          }
          throw {message: 'カード番号とPINの組み合わせが正しくありません。', status: 400, code: err.code}
        })
}

const getPoint = () => {

    return call('GET', `${env.api_domain}/giftcard/point`)
        .then(resp => {
            return resp
        }).catch(err => {
            throw err
        })
}

const getMoney = () => {

    return call('GET', `${env.api_domain}/card/point`)
        .then(resp => {
            return resp
        }).catch(err => {
            throw err
        })
}

const registerCard = (cardParams) => {
    const cardNumber = genCardNumber()
    const reqBody = `name=${cardParams.name}&postal_code=${cardParams.postal}&address=${cardParams.address}&phone_number=${cardParams.phone}&card_number=${cardNumber}&kana=${cardParams.kana}&birth=${cardParams.birth}&mailing_state=${cardParams.mailingState}&gender=${cardParams.gender}`

    return call('POST', `${env.api_domain}/card/pre`, reqBody)
        .then(resp => {
            return resp
        })
        .catch(err => {
            throw {message: err.message, status: 400, code: err.code}
        })
}

const genCardNumber = () => {
    let n = "88002"
    const l = 11
    for(let i = 0; i < l; i++) {
        let r = parseInt(Math.random() * 9) + 1
        n += r
    }
    return n
}

const changeProfile = (params) => {
    const reqBody = `name=${params.name}&postal_code=${params.postal_code}&address=${params.address}&phone_number=${params.phone_number}&card_number=${params.card_number}&kana=${params.kana}&birth=${params.birth}&mailing_state=${params.mailingState}&gender=${params.gender}`

    return call('PUT', `${env.api_domain}/card/profile`, reqBody)
        .then(resp => {
            return resp
        }).catch(err => {
            throw err
        })
}

const fetchProfile = (card_number) => {
    return call('GET', `${env.api_domain}/card/profile`)
        .then(resp => {
            resp = {
                name: "aaa",
                address: "bbbbbbbbb",
                postal: "0392819",
                phone: "09080808080",
            }
            return resp
        }).catch(err => {
            throw err
        })
}

export { signin, getPoint, getMoney, registerCard, changeProfile, fetchProfile }
