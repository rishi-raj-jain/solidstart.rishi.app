const { createServer } = require('http')

module.exports = async (port) => {
  process.env.PORT = port
  createServer(require('../.vercel/output/functions/render.func/Users/rishirajjain/Desktop/solidstart.rishi.app/dist/index.cjs')).listen(port)
}
