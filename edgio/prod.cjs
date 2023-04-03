const { fs } = require('fs')
const { join } = require('path')
const { createServer } = require('http')

module.exports = async (port) => {
  process.env.PORT = port
  const functionPath = fs.readFileSync(join(process.cwd(), 'serverless'), 'utf8')
  createServer(require(`../${functionPath}`)).listen(port)
}
