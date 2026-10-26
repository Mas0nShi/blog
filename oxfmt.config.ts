import config from '@fisch0920/config/oxfmt'

export default {
  ...config,
  ignorePatterns: [
    'pnpm-workspace.yaml',
    '**/next-env.d.ts',
    'packages/notion-utils/fixtures',
    'packages/notion-x-to-md/examples',
    'apps/web/public',
    'apps/web/e2e/fixtures',
    'apps/web/e2e/__screenshots__'
  ]
}
