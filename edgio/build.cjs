const { join } = require('path')
const { DeploymentBuilder } = require('@edgio/core/deploy')

const appDir = process.cwd()

module.exports = async () => {
  const builder = new DeploymentBuilder()
  builder.clearPreviousBuildOutput()
  await builder.exec('npm run build')
  const functionPath = `.vercel/output/functions/render.func/home/dist/index.cjs`
  builder.addJSAsset(functionPath)
  builder.writeFileSync(join(appDir, 'serverless'), functionPath)
  await builder.build()
  builder.writeFileSync(join(builder.jsDir, '__backends__', 'package.json'), JSON.stringify({ type: 'commonjs' }))
}
