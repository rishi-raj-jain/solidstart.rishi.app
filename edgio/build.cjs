const { join } = require('path')
const { nodeFileTrace } = require('@vercel/nft')
const { DeploymentBuilder } = require('@edgio/core/deploy')

const appDir = process.cwd()

module.exports = async () => {
  const builder = new DeploymentBuilder()
  builder.clearPreviousBuildOutput()
  await builder.exec('npm run build')
  builder.addJSAsset(join(appDir, 'dist'))
  await builder.build()
  // Determine the node_modules to include
  let dictNodeModules = await getNodeModules([join(appDir, 'dist', 'server.js')])
  Object.keys(dictNodeModules).forEach(async (i) => {
    try {
      await builder.addJSAsset(`${appDir}/${i}`)
    } catch (e) {
      console.log(e)
    }
  })
  builder.removeSync(join(builder.jsDir, 'dist', 'public'))
  builder.writeFileSync(join(builder.jsDir, '__backends__', 'package.json'), JSON.stringify({ type: 'commonjs' }))
  builder.removeSync(join(builder.jsDir, 'package.json'))
}

async function getNodeModules(files) {
  // Compute file trace
  const { fileList } = await nodeFileTrace(files)
  // Store set of packages
  let packages = {}
  fileList.forEach((i) => {
    if (i.includes('node_modules/')) {
      let temp = i.replace('node_modules/', '')
      temp = temp.substring(0, temp.indexOf('/'))
      packages[`node_modules/${temp}`] = true
    } else {
      packages[i] = true
    }
  })
  // Sort the set of packages
  return Object.keys(packages)
    .sort()
    .reduce((obj, key) => {
      obj[key] = packages[key]
      return obj
    }, {})
}
