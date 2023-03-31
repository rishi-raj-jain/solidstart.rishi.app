const { join } = require('path')
const { DeploymentBuilder } = require('@edgio/core/deploy')

const appDir = process.cwd()

module.exports = async () => {
  const builder = new DeploymentBuilder()
  builder.clearPreviousBuildOutput()
  await builder.exec('npm run build')
  builder.addJSAsset(join(appDir, '.env'))
  builder.addJSAsset('.vercel/output/functions/render.func/Users/rishirajjain/Desktop/solidstart.rishi.app/dist/index.cjs')
  await builder.build()
  builder.writeFileSync(join(builder.jsDir, '__backends__', 'package.json'), JSON.stringify({ type: 'commonjs' }))
}
