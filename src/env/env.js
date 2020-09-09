const env = 'production'

const domain = env => {
    return 'http://localhost:3000/api'
}

export default {
    api_domain: domain(env),
    env: env
}
