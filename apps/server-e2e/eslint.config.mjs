import baseConfig from '../../eslint.config.mjs'

export default [
  ...baseConfig
  // {
  //   files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  //   rules: {
  //     '@nx/enforce-module-boundaries': [
  //       'error',
  //       {
  //         enforceBuildableLibDependency: true,
  //         allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$', '@pro2/server/**'],
  //         depConstraints: [
  //           {
  //             sourceTag: '*',
  //             onlyDependOnLibsWithTags: ['*']
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // }
]
