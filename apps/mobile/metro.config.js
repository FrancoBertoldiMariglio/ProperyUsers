const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot]

// pnpm monorepo support: disable hierarchical lookup for symlinked packages
config.resolver.disableHierarchicalLookup = true

// Tell Metro where to find node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]

// Ensure Metro can resolve packages from the monorepo root
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      // First try project's node_modules, then monorepo root
      const projectPath = path.join(projectRoot, 'node_modules', name)
      const monorepoPath = path.join(monorepoRoot, 'node_modules', name)
      try {
        require.resolve(projectPath)
        return projectPath
      } catch {
        return monorepoPath
      }
    },
  }
)

module.exports = withNativeWind(config, { input: './src/global.css' })
