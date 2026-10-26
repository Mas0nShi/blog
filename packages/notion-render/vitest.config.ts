import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    server: {
      deps: {
        // react-tweet imports CSS modules, which node can't load directly
        inline: ['react-tweet']
      }
    }
  }
})
