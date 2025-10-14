import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: 'e5f91facc6ed44d99810451958362259',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Mas0n\'s blog',
  domain: 'mas0n.org',
  author: 'Mas0n',

  // open graph metadata (optional)
  description: '資訊安全從業者、二進制安全菜鳥、專業醬油 CTFer；思考 everything',

  // social usernames (optional)
  twitter: 'Mas0nShi',
  github: 'Mas0nShi',
  // linkedin: '#',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // ICP & Public Security Record Number
  // icp: '',
  // recordName: '',
  // recordNumber: '',

  // comment system
  walineHost: 'https://line.mas0n.org',

  // google analytics ID
  googleAnalyticsId: 'G-PR1E4LD9CZ',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,
  includeNotionIdInUrls: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `KV_URL`
  // environment variables. see the readme for more info
  isRedisEnabled: false,
  isSearchEnabled: true,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  pageUrlOverrides: {
    '/about': '15cb182beebe432f829e69f1171c5922',
    '/links': '3fa438474af645fa859f28bb58f641be',
  },
  // pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'About',
      pageId: '15cb182beebe432f829e69f1171c5922'
    },
    {
      title: 'Links',
      pageId: '3fa438474af645fa859f28bb58f641be'
    },
  ]
})
