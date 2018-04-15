// Dependencies
// =============================================================================
const browserSync = require('browser-sync').create();
const compression = require('compression');

browserSync.init({
    files: [
        './dist/**/*.*',
        './docs/**/*.*'
    ],
    ghostMode: {
        clicks: false,
        forms : false,
        scroll: false
    },
    open: false,
    notify: false,
    cors: true,
    reloadDebounce: 1000,
    reloadOnRestart: true,
    server: {
        baseDir: [
            './docs/'
        ],
        middleware: [
            compression()
        ]
    },
    serveStatic: [
        './dist/'
    ],
    snippetOptions: {
        rule: {
            match: /<\/body>/i,
            fn: function (snippet, match) {
                // Force enable stylesheet (required for some browsers)
                const styleSwitchFix = `
                    <script>
                        (function() {
                            if (window.MutationObserver) {
                                var browsersyncObserver = new MutationObserver(function(mutationsList) {
                                    mutationsList.forEach(function(mutation) {
                                        Array.apply(null, mutation.addedNodes).forEach(function(node) {
                                            var isStylesheet = node.tagName === 'LINK' && node.hasAttribute('rel') && node.getAttribute('rel').indexOf('stylesheet') !== -1;

                                            if (isStylesheet) {
                                                var isAlternate = node.getAttribute('rel').indexOf('alternate') !== -1;
                                                var isEnabled   = !node.disabled || node.getAttribute('rel').indexOf('alternate') === -1;

                                                if (!isAlternate && isEnabled) {
                                                    node.disabled = true;
                                                    node.disabled = false;
                                                }
                                            }
                                        });
                                    });
                                });
                            }

                            browsersyncObserver.observe(document.documentElement, {
                                childList: true,
                                subtree: true
                            });
                        });
                    </script>
                `;

                return snippet + styleSwitchFix + match;
            }
        }
    },
    rewriteRules: [
        {
            // Replace CDN references with local paths
            match  : /https:\/\/unpkg\.com\/docsify-themeable\/dist\//g,
            replace: '/'
        }
    ]
});
