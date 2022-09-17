const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const math = require('remark-math');
const katex = require('rehype-katex');


/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Zond Docs',
  url: 'https://zond-docs.theqrl.org',
  baseUrl: '/',
  favicon: 'assets/favicon.svg',
  noIndex: false, // Defaults to `false`

/*
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fa'],
    path: 'i18n',
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'en',
      },
      fa: {
        label: 'فارسی',
        direction: 'rtl',
        htmlLang: 'fa-IR',
        calendar: 'persian',
        path: 'fa',
      },
    },
  },
*/

  tagline: 'Documentation for The Quantum Resistant Ledger Zond POS Blockchain',
  onBrokenMarkdownLinks: 'warn',
  onBrokenLinks: 'warn',
  organizationName: 'theQRL', // Usually your GitHub org/user name.
  projectName: 'Zond', // Usually your repo name.
  


  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,    
        autoCollapseCategories: false,
      }
    },
    navbar: {
      title: 'Zond Docs',
      hideOnScroll: true,
      logo: {
        alt: 'The QRL Logo',
        src: 'assets/img/icons/qrl-logo.svg',
      },
      items: [
        {
          to: '/', 
          label: 'Getting Started', 
          position: 'left'
        },
        {
          to: 'Node', 
          label: 'Node', 
          position: 'left'
        },
        {
          to: 'Wallet', 
          label: 'Wallet', 
          position: 'left'
        },
        {
          to: 'QRVM', 
          label: 'QRVM', 
          position: 'left'
        },
/*
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'gettingStarted',
          label: 'Node',
        },
         {
          to: '/tutorials', 
          label: 'Tutorials', 
          position: 'left'
        },
*/        
        {
          to: 'https://theqrl.org', 
          label: 'The QRL', 
          position: 'right'
        },
        {
          to: 'https://theqrl.org/discord', 
          label: 'Discord', 
          position: 'right'
        },
        {
          href: 'https://github.com/theqrl/documentation',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: '/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/theqrl',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/theqrl/documentation/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Quantum Resistant Ledger.`,
    },



    liveCodeBlock: {
      /**
       * The position of the live playground, above or under the editor
       * Possible values: "top" | "bottom"
       */
      playgroundPosition: 'bottom',
    },

    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['powershell'],
    },





  },


  plugins: [

    '@docusaurus/theme-live-codeblock',
    '@docusaurus/plugin-ideal-image',

    [require.resolve('@cmfcmf/docusaurus-search-local'), {
      // whether to index docs pages
      indexDocs: true,
      // must start with "/" and correspond to the routeBasePath configured for the docs plugin
      // use "/" if you use docs-only-mode
      // (see https://v2.docusaurus.io/docs/2.0.0-alpha.70/docs-introduction#docs-only-mode)
      //docsRouteBasePath: '/',

      // Whether to also index the titles of the parent categories in the sidebar of a doc page.
      // 0 disables this feature.
      // 1 indexes the direct parent category in the sidebar of a doc page
      // 2 indexes up to two nested parent categories of a doc page
      // 3...
      //
      // Do _not_ use Infinity, the value must be a JSON-serializable integer.
      indexDocSidebarParentCategories: 4,



      // whether to index blog pages
      indexBlog: false,
      // must start with "/" and correspond to the routeBasePath configured for the blog plugin
      // use "/" if you use blog-only-mode
      // (see https://v2.docusaurus.io/docs/2.0.0-alpha.70/blog#blog-only-mode)
      //blogRouteBasePath: '/blog',

      // whether to index static pages
      // /404.html is never indexed
      indexPages: false,

      // language of your documentation, see next section
      language: "en",

      // setting this to "none" will prevent the default CSS to be included. The default CSS
      // comes from autocomplete-theme-classic, which you can read more about here:
      // https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-theme-classic/
      style: undefined,
      // style: "none",

      // The maximum number of search results shown to the user. This does _not_ affect performance of
      // searches, but simply does not display additional search results that have been found.
      maxSearchResults: 8,
      // lunr.js-specific settings
      lunr: {
        // When indexing your documents, their content is split into "tokens".
        // Text entered into the search box is also tokenized.
        // This setting configures the separator used to determine where to split the text into tokens.
        // By default, it splits the text at whitespace and dashes.
        //
        // Note: Does not work for "ja" and "th" languages, since these use a different tokenizer.
        tokenizerSeparator: /[\s\-]+/,
        b: 0.75,
        k1: 1.2,
        // By default, we rank pages where the search term appears in the title higher than pages where
        // the search term appears in just the text. This is done by "boosting" title matches with a
        // higher value than content matches. The concrete boosting behavior can be controlled by changing
        // the following settings.
        titleBoost: 5,
        contentBoost: 1,
        tagsBoost: 3,
        parentCategoriesBoost: 2, // Only used when indexDocSidebarParentCategories > 0
      }
    }],
     
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // Set this value to '/'.
          remarkPlugins: [math],
          rehypePlugins: [katex],
          editUrl:
            'https://github.com/theqrl/documentation/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
//          customCss: require.resolve('./static/assets/css/overrides.css'),
        },
      },
    ],
  ],


/*
  customFields: {
  },
*/


  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css',
      integrity:
        'sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc',
      crossorigin: 'anonymous',
    },
  ],
};
