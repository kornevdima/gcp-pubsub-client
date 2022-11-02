const { app: { port } } = require('./config')
const app = require('./app')
const onServerCloseHandler = require('./utils/onServerCloseHandler')

async function init () {
  let server

  try {
    server = app.listen(port, () => {
      console.log(`Express App Listening on Port ${port}`)
    })
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`)
    process.exit(1)
  }

  const unexpectedErrorHandler = (error) => {
    console.error(error)
    onServerCloseHandler(server)
  }

  process.on('uncaughtException', unexpectedErrorHandler)
  process.on('unhandledRejection', unexpectedErrorHandler)
}

init()
