(function() {
    const FOOTER_URL = 'footer.html';
    const PLACEHOLDER_ID = 'shared-footer';
    const STYLE_ID = 'shared-footer-style';

    function applyFooterTheme(footer) {
        const bodyClasses = document.body.classList;
        const isDark = bodyClasses.contains('dark') || document.documentElement.classList.contains('dark');

        footer.classList.toggle('light', !isDark);
    }

    async function loadSharedFooter() {
        const placeholder = document.getElementById(PLACEHOLDER_ID);
        if (!placeholder) return;

        try {
            const response = await fetch(FOOTER_URL, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`Cannot load footer from ${FOOTER_URL}: ${response.status}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const style = doc.querySelector('style');
            if (style && !document.getElementById(STYLE_ID)) {
                const styleClone = style.cloneNode(true);
                styleClone.id = STYLE_ID;
                document.head.appendChild(styleClone);
            }

            const footer = doc.querySelector('footer');
            if (footer) {
                applyFooterTheme(footer);
                placeholder.replaceWith(footer);
            } else {
                placeholder.innerHTML = html;
            }
        } catch (error) {
            console.warn('Shared footer failed to load:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSharedFooter);
    } else {
        loadSharedFooter();
    }
})();
