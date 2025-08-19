import nx from '@nx/eslint-plugin'
import unusedImports from 'eslint-plugin-unused-imports'
import prettierRecommended from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/coverage',
      '**/migrationFiles/**',
      '**/out-tsc',
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/test-output'
    ]
  },
  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': 'error'
    }
  },
  prettierRecommended,
  {
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ]
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allowCircularSelfDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*']
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:shared', 'type:atom']
            },
            {
              sourceTag: 'type:shared',
              onlyDependOnLibsWithTags: ['type:atom']
            },
            {
              sourceTag: 'type:atom',
              onlyDependOnLibsWithTags: ['type:atom']
            },
            {
              sourceTag: 'scope:types',
              onlyDependOnLibsWithTags: ['scope:types']
            },
            {
              sourceTag: 'scope:schemas',
              onlyDependOnLibsWithTags: ['scope:types']
            }
          ]
        }
      ]
    }
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs'
    ],
    // Override or add rules here
    rules: {}
  }
]
