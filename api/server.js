let app = require('./app')

app.listen(process.env.API_PORT,() => {
    console.log(`"running on port ${process.env.API_PORT}"`)
})