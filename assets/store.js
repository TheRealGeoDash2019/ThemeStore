(function () {
    "use strict";

    const REMOTE_CATALOGUE_URL = "https://cdn.jsdelivr.net/gh/TheRealGeoDash2019/Rammerhead-Patches/Themes/_index.json";
    const LOCAL_FALLBACK_URL = "./data/themes.json";

    const PALETTE_TOKEN_DEFS = [
        { key: "--browser-accent-color", label: "Toolbar Accent" },
        { key: "--browser-accent-color-dark", label: "Frame / Dark Surface" },
        { key: "--browser-tab-highlight-color", label: "Tab Hover Highlight" },
        { key: "--browser-tab-divider-color", label: "Tab Divider" },
        { key: "--browser-text-primary-color", label: "Primary Text" },
        { key: "--browser-text-secondary-color", label: "Secondary Text" },
        { key: "--browser-icon-color", label: "Toolbar Icon" },
        { key: "--browser-active-icon-color", label: "Active Control Icon" }
    ];

    const EDITOR_TOKEN_DEFS = [
        { key: "--browser-accent-color", simProp: "--ed-accent-color", label: "Toolbar & Active Tab", defaultVal: "#323639", isColor: true },
        { key: "--browser-accent-color-dark", simProp: "--ed-accent-color-dark", label: "Frame & Omnibox Surface", defaultVal: "#202124", isColor: true },
        { key: "--browser-active-icon-color", simProp: "--ed-active-icon-color", label: "Disabled Control Icon", defaultVal: "hsl(210deg 3% 45%)", isColor: true },
        { key: "--browser-ntp-color", simProp: "--ed-ntp-color", label: "New Tab Page Background", defaultVal: "var(--browser-accent-color)", isColor: true },
        { key: "--browser-icon-color", simProp: "--ed-icon-color", label: "Toolbar Icon", defaultVal: "#cccccc", isColor: true },
        {
            key: "--browser-logo-filter",
            simProp: "--ed-logo-filter",
            label: "Logo & Link CSS Filter",
            defaultVal: "invert(1) hue-rotate(310deg) brightness(4)",
            isColor: false,
            presets: [
                { label: "Default Gold", value: "invert(1) hue-rotate(310deg) brightness(4)" },
                { label: "None", value: "none" },
                { label: "Monochrome", value: "grayscale(1) brightness(1.6)" },
                { label: "Crimson", value: " sepia(1) saturate(6) hue-rotate(320deg)" },
                { label: "Violet", value: "hue-rotate(210deg) saturate(1.8)" }
            ]
        },
        { key: "--browser-search-highlight-color", simProp: "--ed-search-highlight-color", label: "Omnibox Search Highlight", defaultVal: "rgb(255 255 255 / 10%)", isColor: true },
        { key: "--browser-tab-divider-color", simProp: "--ed-tab-divider-color", label: "Tab Divider", defaultVal: "#4a4d51", isColor: true },
        { key: "--browser-tab-highlight-color", simProp: "--ed-tab-highlight-color", label: "Background Tab Hover", defaultVal: "#292b2e", isColor: true },
        { key: "--browser-tab-strip", simProp: "--ed-tab-strip", label: "Tab Strip Background", defaultVal: "var(--browser-accent-color-dark)", isColor: true },
        { key: "--browser-text-primary-color", simProp: "--ed-text-primary-color", label: "Primary Text", defaultVal: "#ffffff", isColor: true },
        { key: "--browser-text-secondary-color", simProp: "--ed-text-secondary-color", label: "Secondary & Active Tab Text", defaultVal: "#dddddd", isColor: true }
    ];

    const EDITOR_PRESETS = {
        "default-dark": {
            name: "Custom Theme",
            author: "You!",
            version: "0.0.1",
            tokens: {
                "--browser-accent-color": "#323639",
                "--browser-accent-color-dark": "#202124",
                "--browser-active-icon-color": "hsl(210deg 3% 45%)",
                "--browser-ntp-color": "var(--browser-accent-color)",
                "--browser-icon-color": "#cccccc",
                "--browser-logo-filter": "invert(1) hue-rotate(310deg) brightness(4)",
                "--browser-search-highlight-color": "rgb(255 255 255 / 10%)",
                "--browser-tab-divider-color": "#4a4d51",
                "--browser-tab-highlight-color": "#292b2e",
                "--browser-tab-strip": "var(--browser-accent-color-dark)",
                "--browser-text-primary-color": "#ffffff",
                "--browser-text-secondary-color": "#dddddd"
            }
        },
        "default-light": {
            name: "Chromium Light Theme",
            author: "You!",
            version: "0.0.1",
            tokens: {
                "--browser-accent-color": "#f1f3f4",
                "--browser-accent-color-dark": "#dee1e6",
                "--browser-active-icon-color": "#9aa0a6",
                "--browser-ntp-color": "#ffffff",
                "--browser-icon-color": "#5f6368",
                "--browser-logo-filter": "none",
                "--browser-search-highlight-color": "rgb(0 0 0 / 8%)",
                "--browser-tab-divider-color": "#c4c7c5",
                "--browser-tab-highlight-color": "#e8eaed",
                "--browser-tab-strip": "#dee1e6",
                "--browser-text-primary-color": "#202124",
                "--browser-text-secondary-color": "#444746"
            }
        },
        "amoled-black": {
            name: "Pitch Black AMOLED",
            author: "You!",
            version: "0.0.1",
            tokens: {
                "--browser-accent-color": "#0a0a0a",
                "--browser-accent-color-dark": "#000000",
                "--browser-active-icon-color": "#555555",
                "--browser-ntp-color": "#000000",
                "--browser-icon-color": "#e5e5e5",
                "--browser-logo-filter": "grayscale(1) brightness(1.75)",
                "--browser-search-highlight-color": "rgb(255 255 255 / 12%)",
                "--browser-tab-divider-color": "#1f1f1f",
                "--browser-tab-highlight-color": "#141414",
                "--browser-tab-strip": "#000000",
                "--browser-text-primary-color": "#ffffff",
                "--browser-text-secondary-color": "#cccccc"
            }
        }
    };

    // DOM References
    const searchInput = document.getElementById("searchInput");
    const searchClearBtn = document.getElementById("searchClearBtn");
    const brandHomeLink = document.getElementById("brandHomeLink");
    const previewBannerBtn = document.getElementById("previewBannerBtn");
    const previewBannerText = document.getElementById("previewBannerText");

    const catalogueView = document.getElementById("catalogueView");
    const catalogueHeading = document.getElementById("catalogue-heading");
    const themeCountBadge = document.getElementById("themeCountBadge");
    const activeAuthorChip = document.getElementById("activeAuthorChip");
    const activeAuthorChipLabel = document.getElementById("activeAuthorChipLabel");
    const verifiedFilterChip = document.getElementById("verifiedFilterChip");
    const filterChipBtns = Array.from(document.querySelectorAll(".filter-chips .cr-chip"));
    const sortSelect = document.getElementById("sortSelect");
    const loadingState = document.getElementById("loadingState");
    const emptyState = document.getElementById("emptyState");
    const resetFiltersBtn = document.getElementById("resetFiltersBtn");
    const storeContent = document.getElementById("storeContent");

    const profileView = document.getElementById("profileView");
    const profileBackBtn = document.getElementById("profileBackBtn");
    const breadcrumbRootLink = document.getElementById("breadcrumbRootLink");
    const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");
    const prevThemeBtn = document.getElementById("prevThemeBtn");
    const nextThemeBtn = document.getElementById("nextThemeBtn");

    const profileHeroCard = document.getElementById("profileHeroCard");
    const profileIcon = document.getElementById("profileIcon");
    const profileHeading = document.getElementById("profile-heading");
    const profileVerifiedBadge = document.getElementById("profileVerifiedBadge");
    const profileStatusBadge = document.getElementById("profileStatusBadge");
    const profileAuthorBtn = document.getElementById("profileAuthorBtn");
    const profileAuthorText = document.getElementById("profileAuthorText");
    const profileToneBadge = document.getElementById("profileToneBadge");
    const profileVersionPill = document.getElementById("profileVersionPill");
    const profilePreviewBtn = document.getElementById("profilePreviewBtn");
    const profilePreviewBtnLabel = document.getElementById("profilePreviewBtnLabel");
    const profileInstallBtn = document.getElementById("profileInstallBtn");
    const profileInstallBtnLabel = document.getElementById("profileInstallBtnLabel");
    const profileCustomizeBtn = document.getElementById("profileCustomizeBtn");
    const openEditorBtn = document.getElementById("openEditorBtn");

    const editorView = document.getElementById("editorView");
    const editorBackBtn = document.getElementById("editorBackBtn");
    const editorBreadcrumbRootLink = document.getElementById("editorBreadcrumbRootLink");
    const editorPresetSelect = document.getElementById("editorPresetSelect");
    const editorCatalogueOptgroup = document.getElementById("editorCatalogueOptgroup");
    const editorInitBtn = document.getElementById("editorInitBtn");
    const editorImportBtn = document.getElementById("editorImportBtn");
    const editorImportFile = document.getElementById("editorImportFile");
    const editorThemeIcon = document.getElementById("editorThemeIcon");
    const editorHeading = document.getElementById("editor-heading");
    const editorContrastBadge = document.getElementById("editorContrastBadge");
    const editorContrastIcon = document.getElementById("editorContrastIcon");
    const editorContrastText = document.getElementById("editorContrastText");
    const editorApplyStoreBtn = document.getElementById("editorApplyStoreBtn");
    const editorApplyStoreLabel = document.getElementById("editorApplyStoreLabel");
    const editorCopyCssBtn = document.getElementById("editorCopyCssBtn");
    const editorExportBtn = document.getElementById("editorExportBtn");
    const themeEditorForm = document.getElementById("themeEditorForm");
    const editorMetaName = document.getElementById("editorMetaName");
    const editorMetaAuthor = document.getElementById("editorMetaAuthor");
    const editorMetaVersion = document.getElementById("editorMetaVersion");
    const editorTokensList = document.getElementById("editorTokensList");
    const editorBrowserFrame = document.getElementById("editorBrowserFrame");
    const editorSimUrlText = document.getElementById("editorSimUrlText");
    const editorSceneNewtab = document.getElementById("editorSceneNewtab");
    const editorSceneStore = document.getElementById("editorSceneStore");
    const editorOmniboxMenu = document.getElementById("editorOmniboxMenu");
    const edMiniAvatar1 = document.getElementById("edMiniAvatar1");
    const edMiniTitle1 = document.getElementById("edMiniTitle1");
    const edMiniAuthor1 = document.getElementById("edMiniAuthor1");
    const editorTabBtns = Array.from(document.querySelectorAll("[data-editor-tab]"));
    const editorCssByteCount = document.getElementById("editorCssByteCount");
    const editorCodeCopyBtn = document.getElementById("editorCodeCopyBtn");
    const editorCodeDownloadBtn = document.getElementById("editorCodeDownloadBtn");
    const editorCssOutput = document.getElementById("editorCssOutput");

    const metricAuthor = document.getElementById("metricAuthor");
    const metricVersion = document.getElementById("metricVersion");
    const metricMode = document.getElementById("metricMode");
    const metricContrast = document.getElementById("metricContrast");

    const browserMockup = document.getElementById("browserMockup");
    const mockupUrlText = document.getElementById("mockupUrlText");
    const mockupPageNewtab = document.getElementById("mockupPageNewtab");
    const mockupPageStore = document.getElementById("mockupPageStore");
    const mockupTabSwitchBtns = Array.from(document.querySelectorAll("[data-mockup-tab]"));

    const profileDescription = document.getElementById("profileDescription");
    const profilePaletteGrid = document.getElementById("profilePaletteGrid");
    const profileSourceUrl = document.getElementById("profileSourceUrl");
    const copyUrlBtn = document.getElementById("copyUrlBtn");
    const downloadCssBtn = document.getElementById("downloadCssBtn");
    const githubRow = document.getElementById("githubRow");
    const profileGithubLink = document.getElementById("profileGithubLink");
    const profileEnvStatus = document.getElementById("profileEnvStatus");
    const profileEnvTypeChip = document.getElementById("profileEnvTypeChip");
    const cssByteCount = document.getElementById("cssByteCount");
    const copyCssSourceBtn = document.getElementById("copyCssSourceBtn");
    const profileCssCode = document.getElementById("profileCssCode");

    const relatedHeading = document.getElementById("relatedHeading");
    const relatedViewAllLink = document.getElementById("relatedViewAllLink");
    const relatedGrid = document.getElementById("relatedGrid");
    const toastHost = document.getElementById("toastHost");

    // Store State
    let themes = [];
    const cssCache = new Map();
    const iconCache = new Map();

    let activeFilter = "all";
    let activeAuthor = null;
    let activeSort = "featured";
    let activeProfileSlug = null;
    let isEditorOpen = false;
    let previewThemeUrl = null;
    let isEditorStorePreviewActive = false;
    let lastSelectedSlug = null;

    const editorTokenState = { ...EDITOR_PRESETS["default-dark"].tokens };
    const editorControlRefs = new Map();

    // Tracks whether an in-app root history entry sits behind a drill-down view
    const initialParams = new URLSearchParams(window.location.search);
    let hasInAppRootHistory = !initialParams.has("theme") && !initialParams.has("editor");

    // =========================================================================
    // Icon Generation & Color Helpers
    // =========================================================================

    function getSafeTextColor(input = "#000000") {
        return "#" + tinycolor.mostReadable(input, ["#ffffff", "#111111"], { wcag2: {} }).toHex();
    }

    function generateTextIcon(initial = "T", accent = "#ffdf8c") {
        const cacheKey = `${initial}::${accent}`;
        if (iconCache.has(cacheKey)) return iconCache.get(cacheKey);

        const size = 192;
        const radius = 38;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Base rounded tile
        ctx.beginPath();
        ctx.roundRect(0, 0, size, size, radius);
        ctx.fillStyle = accent;
        ctx.fill();

        // Subtle top-left sheen for crisp app-icon depth
        const grad = ctx.createLinearGradient(0, 0, size, size);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.12)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0.14)");
        ctx.fillStyle = grad;
        ctx.fill();

        // Subtle inner ring so ultra-dark AMOLED icons stand out on dark cards
        const isDark = tinycolor(accent).isDark();
        ctx.lineWidth = 3;
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(0, 0, 0, 0.12)";
        ctx.stroke();

        // Centered monogram letter
        const fg = getSafeTextColor(accent);
        ctx.fillStyle = fg;
        ctx.font = "600 88px 'Segoe UI', system-ui, -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(initial, size / 2, size / 2 + 3);

        const dataUrl = canvas.toDataURL("image/png");
        iconCache.set(cacheKey, dataUrl);
        return dataUrl;
    }

    window.getSafeTextColor = getSafeTextColor;
    window.generateTextIcon = generateTextIcon;

    function slugify(text, usedSlugs) {
        const base = String(text || "theme")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "theme";
        let slug = base;
        let idx = 2;
        while (usedSlugs.has(slug)) {
            slug = `${base}-${idx++}`;
        }
        usedSlugs.add(slug);
        return slug;
    }

    function synthesizeDescription(name, author, accent) {
        const lower = String(name || "").toLowerCase();
        const isLight = tinycolor(accent || "#202020").isLight();
        if (lower.includes("gruvbox")) {
            const mode = lower.includes("light") ? "light" : "dark";
            const contrast = lower.includes("hard")
                ? "crisp high-contrast"
                : lower.includes("soft")
                    ? "gentle low-fatigue"
                    : "balanced medium-contrast";
            return `Retro Gruvbox ${mode} palette with ${contrast} warm tones crafted for Rammerhead.`;
        }
        if (lower.includes("dark theme")) {
            return `Clean Chromium-inspired dark interface theme crafted for Rammerhead by ${author}.`;
        }
        return `Custom ${isLight ? "light" : "dark"} browser theme for Rammerhead created by ${author}.`;
    }

    function classifyColorTokens(accent, accentDark) {
        const c = tinycolor(accent || "#202020");
        const cd = tinycolor(accentDark || accent || "#151515");
        const isLight = c.isLight();
        const isAmoled = !isLight && c.getLuminance() < 0.016 && cd.getLuminance() < 0.012;
        const isColorful = c.toHsl().s >= 0.28;

        let toneLabel = "Dark Theme";
        if (isAmoled) toneLabel = "AMOLED Black";
        else if (isLight) toneLabel = "Light Theme";
        else if (isColorful) toneLabel = "Vibrant Dark";

        return { isLight, isAmoled, isColorful, toneLabel };
    }

    function buildDefaultTokens(theme) {
        const accent = theme.accent || "#323639";
        const tc = tinycolor(accent);
        const accentDark = tc.isLight()
            ? tc.clone().lighten(5).toHexString()
            : tc.clone().darken(7).toHexString();
        const textPrimary = getSafeTextColor(accentDark);
        const textSecondary = getSafeTextColor(accent);
        const tabHighlight = tc.isLight()
            ? tc.clone().darken(8).toHexString()
            : tc.clone().lighten(8).toHexString();

        return {
            "--browser-accent-color": accent,
            "--browser-accent-color-dark": accentDark,
            "--browser-tab-divider-color": tabHighlight,
            "--browser-tab-highlight-color": tabHighlight,
            "--browser-text-primary-color": textPrimary,
            "--browser-text-secondary-color": textSecondary,
            "--browser-icon-color": tc.isLight() ? "#7c6f64" : "#cccccc",
            "--browser-active-icon-color": tc.isLight() ? "#504945" : "#8a8d91",
            "--browser-logo-filter": "none"
        };
    }

    function parseThemeCss(rawCss, theme) {
        const defaults = buildDefaultTokens(theme);
        const cleanCss = rawCss.replace(/\/\*[\s\S]*?\*\//g, "");
        const rawVars = {};
        const regex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;\}]+)/g;
        let match;
        while ((match = regex.exec(cleanCss)) !== null) {
            rawVars[match[1].trim()] = match[2].trim();
        }

        // Alias common upstream shorthand `--browser-accent-dark`
        if (!rawVars["--browser-accent-dark"] && rawVars["--browser-accent-color-dark"]) {
            rawVars["--browser-accent-dark"] = rawVars["--browser-accent-color-dark"];
        }

        const resolved = { ...defaults };
        for (const [key, val] of Object.entries(rawVars)) {
            let current = val;
            const varMatch = current.match(/^var\(\s*(--[a-zA-Z0-9_-]+)\s*\)$/);
            if (varMatch) {
                const refKey = varMatch[1];
                current = rawVars[refKey] || defaults[refKey] || current;
            }
            resolved[key] = current;
        }

        const accent = resolved["--browser-accent-color"] || theme.accent;
        const accentDark = resolved["--browser-accent-color-dark"] || defaults["--browser-accent-color-dark"];
        const textPrimary = resolved["--browser-text-primary-color"] || defaults["--browser-text-primary-color"];
        const classification = classifyColorTokens(accent, accentDark);

        let contrastText = "—";
        const c1 = tinycolor(accentDark);
        const c2 = tinycolor(textPrimary);
        if (c1.isValid() && c2.isValid()) {
            const ratio = tinycolor.readability(c1, c2);
            const grade = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA Large" : "Decorative";
            contrastText = `${ratio.toFixed(1)}:1 · ${grade}`;
        }

        return {
            rawCss: rawCss.trim(),
            tokens: resolved,
            ...classification,
            contrastText
        };
    }

    async function hydrateThemeCss(theme) {
        if (!theme.url) return theme.parsed;
        if (cssCache.has(theme.url)) {
            theme.parsed = cssCache.get(theme.url);
            return theme.parsed;
        }
        try {
            const resp = await fetch(theme.url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const cssText = await resp.text();
            const parsed = parseThemeCss(cssText, theme);
            cssCache.set(theme.url, parsed);
            theme.parsed = parsed;
            return parsed;
        } catch {
            const fallback = parseThemeCss("", theme);
            theme.parsed = fallback;
            return fallback;
        }
    }

    // =========================================================================
    // Toast Notifications (`popover="manual"` + Progressive Fallback)
    // =========================================================================

    function restackToasts() {
        const items = Array.from(toastHost.querySelectorAll(".toast-item"));
        let offset = 0;
        for (let i = items.length - 1; i >= 0; i--) {
            items[i].style.setProperty("--toast-offset", `${offset}px`);
            offset += (items[i].offsetHeight || 44) + 8;
        }
    }

    function showToast(message) {
        const supportsPopover = "popover" in HTMLElement.prototype;
        const toast = document.createElement("div");
        toast.className = "toast-item";
        if (supportsPopover) {
            toast.setAttribute("popover", "manual");
        }

        const textSpan = document.createElement("span");
        textSpan.textContent = message;

        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "toast-close-btn";
        closeBtn.setAttribute("aria-label", "Close notification");
        closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

        let dismissed = false;
        const dismiss = () => {
            if (dismissed) return;
            dismissed = true;
            if (supportsPopover && toast.matches(":popover-open")) {
                try { toast.hidePopover(); } catch { /* ignore */ }
            }
            toast.classList.remove("is-open");
            setTimeout(() => {
                toast.remove();
                restackToasts();
            }, 190);
        };

        closeBtn.addEventListener("click", dismiss);
        toast.append(textSpan, closeBtn);
        toastHost.appendChild(toast);

        if (supportsPopover) {
            try {
                toast.showPopover();
            } catch {
                toast.classList.add("is-open");
            }
        } else {
            requestAnimationFrame(() => toast.classList.add("is-open"));
        }

        restackToasts();
        setTimeout(dismiss, 3400);
    }

    // =========================================================================
    // Theme Preview & Installation Actions
    // =========================================================================

    function isThemeInstalled(theme) {
        return Boolean(theme?.url && window.__installedThemeUrl && window.__installedThemeUrl === theme.url);
    }

    function isThemePreviewing(theme) {
        return Boolean(theme?.url && previewThemeUrl && previewThemeUrl === theme.url);
    }

    function updatePreviewBanner() {
        if (isEditorStorePreviewActive) {
            const customName = (editorMetaName?.value || "Custom Theme").trim() || "Custom Theme";
            previewBannerText.textContent = customName;
            previewBannerBtn.title = `Previewing "${customName}" from Theme Editor — click to exit preview`;
            previewBannerBtn.classList.remove("hidden");
        } else if (previewThemeUrl) {
            const match = themes.find(t => t.url === previewThemeUrl);
            previewBannerText.textContent = match ? match.name : "Previewing";
            previewBannerBtn.title = match
                ? `Previewing "${match.name}" — click to exit preview`
                : "Exit live store preview";
            previewBannerBtn.classList.remove("hidden");
        } else {
            previewBannerBtn.classList.add("hidden");
        }
    }

    function applyEditorStoreLiveStyle() {
        let styleEl = document.getElementById("editor-live-store-style");
        if (!isEditorStorePreviewActive) {
            styleEl?.remove();
            if (editorApplyStoreBtn && editorApplyStoreLabel) {
                editorApplyStoreBtn.setAttribute("aria-pressed", "false");
                editorApplyStoreBtn.classList.remove("cr-btn--tonal");
                editorApplyStoreBtn.classList.add("cr-btn--outline");
                editorApplyStoreLabel.textContent = "Test on Store UI";
            }
            return;
        }
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "editor-live-store-style";
            document.head.appendChild(styleEl);
        }
        const rules = EDITOR_TOKEN_DEFS.map(def => `  ${def.key}: ${editorTokenState[def.key] || def.defaultVal} !important;`).join("\n");
        styleEl.textContent = `html, html.custom-theme {\n${rules}\n}`;
        if (editorApplyStoreBtn && editorApplyStoreLabel) {
            editorApplyStoreBtn.setAttribute("aria-pressed", "true");
            editorApplyStoreBtn.classList.remove("cr-btn--outline");
            editorApplyStoreBtn.classList.add("cr-btn--tonal");
            editorApplyStoreLabel.textContent = "Live on Store UI";
        }
    }

    function setLivePreview(theme) {
        if (!theme?.url) return;
        isEditorStorePreviewActive = false;
        applyEditorStoreLiveStyle();
        if (previewThemeUrl === theme.url) {
            clearLivePreview();
            showToast("Exited live preview");
            return;
        }
        previewThemeUrl = theme.url;
        window.themeSettingsPage?.(theme.url);
        updatePreviewBanner();
        syncAllActionStates();
        showToast(`Previewing "${theme.name}" on store`);
    }

    function clearLivePreview() {
        previewThemeUrl = null;
        isEditorStorePreviewActive = false;
        applyEditorStoreLiveStyle();
        window.themeSettingsPage?.(window.__installedThemeUrl || null);
        updatePreviewBanner();
        syncAllActionStates();
    }

    async function handleInstallTheme(theme) {
        if (!theme?.url) return;

        if (window.isRammerheadEnvironment?.()) {
            previewThemeUrl = null;
            updatePreviewBanner();
            window.toggleTheme(theme.url);
            window.themeSettingsPage?.(theme.url);
            syncAllActionStates();
            showToast(`Installed "${theme.name}"`);
            return;
        }

        // Outside Better Rammerhead: apply live preview and copy URL for easy use
        previewThemeUrl = theme.url;
        window.themeSettingsPage?.(theme.url);
        updatePreviewBanner();
        syncAllActionStates();

        let copied = false;
        try {
            await navigator.clipboard.writeText(theme.url);
            copied = true;
        } catch {
            copied = false;
        }
        showToast(
            copied
                ? `Preview enabled & theme URL copied! Open in Better Rammerhead for 1-click install.`
                : `Preview enabled! Open in Better Rammerhead to install directly.`
        );
    }

    // =========================================================================
    // Card Construction & Grid Rendering
    // =========================================================================

    function buildProfileHref(slug) {
        const params = new URLSearchParams(window.location.search);
        params.set("theme", slug);
        return `?${params.toString()}`;
    }

    function renderMiniPalette(container, parsed) {
        if (!container || !parsed?.tokens) return;
        const swatchKeys = [
            "--browser-accent-color-dark",
            "--browser-accent-color",
            "--browser-tab-highlight-color",
            "--browser-text-primary-color"
        ];
        container.innerHTML = "";
        for (const key of swatchKeys) {
            const val = parsed.tokens[key];
            if (!val || !tinycolor(val).isValid()) continue;
            const dot = document.createElement("span");
            dot.className = "mini-swatch";
            dot.style.backgroundColor = val;
            container.appendChild(dot);
        }
    }

    function updateCardActionState(cardEl, theme) {
        const installed = isThemeInstalled(theme);
        const previewing = isThemePreviewing(theme);

        cardEl.classList.toggle("is-active-theme", installed || previewing);

        const statusPill = cardEl.querySelector(".card-status-pill");
        if (installed) {
            statusPill.textContent = "Installed";
            statusPill.classList.remove("hidden", "is-preview");
        } else if (previewing) {
            statusPill.textContent = "Previewing";
            statusPill.classList.remove("hidden");
            statusPill.classList.add("is-preview");
        } else {
            statusPill.classList.add("hidden");
            statusPill.classList.remove("is-preview");
        }

        const previewBtn = cardEl.querySelector(".card-preview-btn");
        previewBtn.setAttribute("aria-pressed", String(previewing));
        previewBtn.title = previewing ? "Exit live preview" : "Live preview on store";

        const installBtn = cardEl.querySelector(".card-install-btn");
        const installLabel = cardEl.querySelector(".install-label");
        installBtn.classList.toggle("is-installed", installed);
        installLabel.textContent = installed ? "Installed" : "Install";
    }

    function createThemeCardElement(theme) {
        const fragment = document.getElementById("theme-template").content.cloneNode(true);
        const card = fragment.querySelector(".theme-card");
        card.dataset.slug = theme.slug;

        const iconImg = card.querySelector(".theme-icon");
        const cardLink = card.querySelector(".card-link");
        const verifiedBadge = card.querySelector(".card-verified-badge");
        const versionEl = card.querySelector(".theme-version");
        const authorEl = card.querySelector(".theme-author");
        const descEl = card.querySelector(".theme-description");
        const detailsLink = card.querySelector(".details-link");
        const detailsSrSuffix = card.querySelector(".details-sr-suffix");
        const miniPalette = card.querySelector(".mini-palette");
        const previewBtn = card.querySelector(".card-preview-btn");
        const installBtn = card.querySelector(".card-install-btn");

        const profileHref = buildProfileHref(theme.slug);

        iconImg.src = theme.icon;
        cardLink.textContent = theme.name;
        cardLink.href = profileHref;
        if (theme.verified) {
            cardLink.title = `${theme.name} — Verified theme`;
            verifiedBadge.classList.remove("hidden");
        } else {
            verifiedBadge.classList.add("hidden");
        }
        versionEl.textContent = theme.version;
        authorEl.textContent = `by ${theme.author}`;
        descEl.textContent = theme.description;

        detailsLink.href = profileHref;
        detailsSrSuffix.textContent = ` for ${theme.name}`;
        previewBtn.setAttribute("aria-label", `Live preview ${theme.name}`);
        installBtn.setAttribute("aria-label", `Install ${theme.name}`);

        renderMiniPalette(miniPalette, theme.parsed);
        updateCardActionState(card, theme);

        const handleCardDrillDown = (e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            openThemeProfile(theme.slug, { pushHistory: true, sourceCard: card });
        };

        cardLink.addEventListener("click", handleCardDrillDown);
        detailsLink.addEventListener("click", handleCardDrillDown);

        previewBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            setLivePreview(theme);
        });

        installBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            handleInstallTheme(theme);
        });

        return card;
    }

    function getFilteredThemes() {
        const query = searchInput.value.trim().toLowerCase();

        let list = themes.filter((theme) => {
            if (activeAuthor && theme.author.toLowerCase() !== activeAuthor.toLowerCase()) {
                return false;
            }
            if (activeFilter === "verified" && !theme.verified) return false;
            if (activeFilter === "dark" && theme.parsed.isLight) return false;
            if (activeFilter === "light" && !theme.parsed.isLight) return false;
            if (activeFilter === "amoled" && !theme.parsed.isAmoled) return false;
            if (activeFilter === "colorful" && !theme.parsed.isColorful) return false;

            if (!query) return true;
            const haystack = `${theme.name} ${theme.description} ${theme.author} ${theme.parsed.toneLabel} ${theme.verified ? "verified" : ""}`.toLowerCase();
            return haystack.includes(query);
        });

        if (activeSort === "name") {
            list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        } else if (activeSort === "author") {
            list = [...list].sort((a, b) => a.author.localeCompare(b.author) || a.name.localeCompare(b.name));
        }
        return list;
    }

    function renderCatalogue() {
        loadingState.classList.add("hidden");
        const filtered = getFilteredThemes();

        const hasQuery = Boolean(searchInput.value.trim());
        const hasFilter = activeFilter !== "all" || Boolean(activeAuthor);
        catalogueHeading.textContent = hasQuery
            ? "Search results"
            : activeFilter === "all"
                ? "All themes"
                : `${activeFilter === "amoled" ? "AMOLED" : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} themes`;
        themeCountBadge.textContent = hasQuery || hasFilter
            ? `${filtered.length} of ${themes.length}`
            : String(themes.length);

        if (activeAuthor) {
            activeAuthorChipLabel.textContent = `Author: ${activeAuthor}`;
            activeAuthorChip.classList.remove("hidden");
        } else {
            activeAuthorChip.classList.add("hidden");
        }

        storeContent.innerHTML = "";
        if (filtered.length === 0) {
            emptyState.classList.remove("hidden");
            return;
        }

        emptyState.classList.add("hidden");
        const frag = document.createDocumentFragment();
        for (const theme of filtered) {
            frag.appendChild(createThemeCardElement(theme));
        }
        storeContent.appendChild(frag);
    }

    // =========================================================================
    // App Profile / Extension Detail View Rendering
    // =========================================================================

    function setMockupActiveTab(tabName) {
        const isStore = tabName === "store";
        mockupPageNewtab.classList.toggle("hidden", isStore);
        mockupPageStore.classList.toggle("hidden", !isStore);
        mockupUrlText.textContent = isStore ? "https://themes.lhost.dev" : "rh://newtab";

        for (const btn of mockupTabSwitchBtns) {
            const match = btn.dataset.mockupTab === tabName;
            btn.classList.toggle("active", match);
            if (btn.getAttribute("role") === "tab") {
                btn.setAttribute("aria-selected", String(match));
            }
        }
    }

    function applyMockupTokens(theme) {
        const t = theme.parsed.tokens;
        const accent = t["--browser-accent-color"] || theme.accent;
        const accentDark = t["--browser-accent-color-dark"] || accent;
        const textPrimary = t["--browser-text-primary-color"] || "#ffffff";
        const textSecondary = t["--browser-text-secondary-color"] || textPrimary;

        profileHeroCard.style.setProperty("--hero-accent", accent);
        profileHeroCard.style.setProperty("--hero-accent-dark", accentDark);
        profileHeroCard.style.setProperty("--hero-text", textPrimary);

        browserMockup.style.setProperty("--p-accent", accent);
        browserMockup.style.setProperty("--p-accent-dark", accentDark);
        browserMockup.style.setProperty("--p-tab-divider", t["--browser-tab-divider-color"] || accent);
        browserMockup.style.setProperty("--p-tab-highlight", t["--browser-tab-highlight-color"] || accentDark);
        browserMockup.style.setProperty("--p-text-primary", textPrimary);
        browserMockup.style.setProperty("--p-text-secondary", textSecondary);
        browserMockup.style.setProperty("--p-icon", t["--browser-icon-color"] || textPrimary);
        browserMockup.style.setProperty("--p-active-icon", t["--browser-active-icon-color"] || textPrimary);

        const rawFilter = t["--browser-logo-filter"];
        const cleanFilter = (!rawFilter || rawFilter === '""' || rawFilter === "''") ? "none" : rawFilter;
        browserMockup.style.setProperty("--p-logo-filter", cleanFilter);
        profileEnvTypeChip.textContent = `Unknown Environment`;
    }

    function renderPaletteSwatches(theme) {
        profilePaletteGrid.innerHTML = "";
        const tokens = theme.parsed.tokens;

        for (const def of PALETTE_TOKEN_DEFS) {
            const val = tokens[def.key];
            if (!val) continue;

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "palette-swatch-btn";
            btn.title = `Copy ${val} (${def.key})`;

            const chip = document.createElement("span");
            chip.className = "swatch-chip";
            chip.style.backgroundColor = val;

            const meta = document.createElement("span");
            meta.className = "swatch-meta";

            const title = document.createElement("span");
            title.className = "swatch-title";
            title.textContent = def.label;

            const code = document.createElement("span");
            code.className = "swatch-value";
            const hexDisplay = tinycolor(val).isValid() && tinycolor(val).getAlpha() === 1
                ? tinycolor(val).toHexString().toUpperCase()
                : val;
            code.textContent = hexDisplay;

            meta.append(title, code);
            btn.append(chip, meta);

            btn.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(hexDisplay);
                    showToast(`Copied ${hexDisplay} (${def.label})`);
                } catch {
                    showToast(`${def.label}: ${hexDisplay}`);
                }
            });

            profilePaletteGrid.appendChild(btn);
        }
    }

    function renderRelatedThemes(currentTheme) {
        const sameAuthor = themes.filter(t => t.slug !== currentTheme.slug && t.author === currentTheme.author);
        const others = themes.filter(t => t.slug !== currentTheme.slug && t.author !== currentTheme.author);
        const picks = [...sameAuthor, ...others].slice(0, 3);

        relatedHeading.textContent = sameAuthor.length > 0
            ? `More by ${currentTheme.author}`
            : "More themes to explore";

        relatedGrid.innerHTML = "";
        for (const item of picks) {
            relatedGrid.appendChild(createThemeCardElement(item));
        }
    }

    function updateProfileActionState(theme) {
        if (!theme) return;
        const installed = isThemeInstalled(theme);
        const previewing = isThemePreviewing(theme);

        if (installed) {
            profileStatusBadge.textContent = "Installed";
            profileStatusBadge.classList.remove("hidden", "is-preview");
        } else if (previewing) {
            profileStatusBadge.textContent = "Preview Active";
            profileStatusBadge.classList.remove("hidden");
            profileStatusBadge.classList.add("is-preview");
        } else {
            profileStatusBadge.classList.add("hidden");
            profileStatusBadge.classList.remove("is-preview");
        }

        profilePreviewBtn.setAttribute("aria-pressed", String(previewing));
        profilePreviewBtnLabel.textContent = previewing ? "Exit Preview" : "Try Preview";

        profileInstallBtn.classList.toggle("is-installed", installed);
        profileInstallBtnLabel.textContent = installed ? "Installed" : "Install Theme";

        const inRh = Boolean(window.isRammerheadEnvironment?.());
        profileEnvStatus.textContent = inRh
            ? "Connected to Better Rammerhead — one-click theme installation active."
            : "Browsing on the web — use Try Preview to test live, or open inside Better Rammerhead to install directly.";
    }

    function populateProfileView(theme) {
        document.title = `${theme.name} — Theme Store`;
        breadcrumbCurrent.textContent = theme.name;

        profileIcon.src = theme.icon;
        profileHeading.textContent = theme.name;
        profileHeading.title = theme.name;
        profileVerifiedBadge.classList.toggle("hidden", !theme.verified);
        profileAuthorText.textContent = theme.author;
        profileToneBadge.textContent = theme.parsed.toneLabel;
        profileVersionPill.textContent = `v${theme.version}`;

        metricAuthor.textContent = theme.author;
        metricVersion.textContent = theme.version;
        metricMode.textContent = theme.parsed.toneLabel;
        metricContrast.textContent = theme.parsed.contrastText;

        profileDescription.textContent = theme.description;
        profileSourceUrl.textContent = theme.url || "Unavailable";

        if (theme.githubUrl) {
            githubRow.classList.remove("hidden");
            profileGithubLink.href = theme.githubUrl;
        } else {
            githubRow.classList.add("hidden");
        }

        const rawCss = theme.parsed.rawCss;
        if (rawCss) {
            profileCssCode.textContent = rawCss;
            cssByteCount.textContent = `${new Blob([rawCss]).size} bytes · CSS`;
        } else {
            profileCssCode.textContent = "Fetching stylesheet source…";
            cssByteCount.textContent = "CSS stylesheet";
        }

        // Prev / Next cycle indices
        const idx = themes.findIndex(t => t.slug === theme.slug);
        const prevTheme = themes[(idx - 1 + themes.length) % themes.length];
        const nextTheme = themes[(idx + 1) % themes.length];
        prevThemeBtn.title = prevTheme ? `Previous: ${prevTheme.name}` : "Previous theme";
        nextThemeBtn.title = nextTheme ? `Next: ${nextTheme.name}` : "Next theme";

        applyMockupTokens(theme);
        renderPaletteSwatches(theme);
        renderRelatedThemes(theme);
        updateProfileActionState(theme);

        // Ensure full CSS source is hydrated if user jumped straight into detail view
        if (!cssCache.has(theme.url) && theme.url) {
            hydrateThemeCss(theme).then(() => {
                if (activeProfileSlug === theme.slug) {
                    profileToneBadge.textContent = theme.parsed.toneLabel;
                    metricMode.textContent = theme.parsed.toneLabel;
                    metricContrast.textContent = theme.parsed.contrastText;
                    applyMockupTokens(theme);
                    renderPaletteSwatches(theme);
                    if (theme.parsed.rawCss) {
                        profileCssCode.textContent = theme.parsed.rawCss;
                        cssByteCount.textContent = `${new Blob([theme.parsed.rawCss]).size} bytes · CSS`;
                    }
                }
            });
        }
    }

    function syncAllActionStates() {
        for (const cardEl of document.querySelectorAll(".theme-card[data-slug]")) {
            const t = themes.find(item => item.slug === cardEl.dataset.slug);
            if (t) updateCardActionState(cardEl, t);
        }
        if (activeProfileSlug) {
            const activeTheme = themes.find(item => item.slug === activeProfileSlug);
            if (activeTheme) updateProfileActionState(activeTheme);
        }
    }

    // =========================================================================
    // Native Rammerhead Theme Editor
    // =========================================================================

    function resolveTokenToHex(rawVal, fallbackHex = "#323639", depth = 0) {
        if (!rawVal || depth > 4) return fallbackHex;
        const trimmed = String(rawVal).trim();
        const varMatch = trimmed.match(/^var\(\s*(--[a-zA-Z0-9-_]+)\s*\)$/);
        if (varMatch && editorTokenState[varMatch[1]]) {
            return resolveTokenToHex(editorTokenState[varMatch[1]], fallbackHex, depth + 1);
        }
        // Normalize CSS Color 4 space-separated syntax for tinycolor
        const normalized = trimmed
            .replace(/deg/gi, "")
            .replace(/^hsl\(\s*([\d.]+)\s+([\d.]+%)\s+([\d.]+%)\s*\)$/i, "hsl($1, $2, $3)")
            .replace(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+%?)\s*\)$/i, "rgba($1, $2, $3, $4)");
        const tc = tinycolor(normalized);
        return tc.isValid() ? tc.toHexString() : fallbackHex;
    }

    function generateEditorCssText() {
        const metaName = (editorMetaName.value || "Custom Theme").trim() || "Custom Theme";
        const metaAuthor = (editorMetaAuthor.value || "You!").trim() || "You!";
        const metaVersion = (editorMetaVersion.value || "0.0.1").trim() || "0.0.1";

        const lines = [
            "/*",
            `  @name    ${metaName}`,
            `  @author  ${metaAuthor}`,
            `  @version ${metaVersion}`,
            "*/",
            "",
            "html.custom-theme {",
            ...EDITOR_TOKEN_DEFS.map(def => `  ${def.key}: ${editorTokenState[def.key] || def.defaultVal};`),
            "}"
        ];
        return lines.join("\n");
    }

    function updateEditorLiveState() {
        const metaName = (editorMetaName.value || "Custom Theme").trim() || "Custom Theme";
        const metaAuthor = (editorMetaAuthor.value || "You!").trim() || "You!";
        const accentHex = resolveTokenToHex(editorTokenState["--browser-accent-color"], "#323639");
        const darkHex = resolveTokenToHex(editorTokenState["--browser-accent-color-dark"], accentHex);
        const textHex = resolveTokenToHex(editorTokenState["--browser-text-primary-color"], "#ffffff");

        // Update generated icon & mini store preview labels
        const initial = metaName.split("").find(ch => /[a-z0-9]/i.test(ch)) || "C";
        editorThemeIcon.src = generateTextIcon(initial.toUpperCase(), accentHex);
        edMiniAvatar1.textContent = initial.toUpperCase();
        edMiniTitle1.textContent = metaName;
        edMiniAuthor1.textContent = `by ${metaAuthor}`;

        // Update WCAG contrast badge (uses both icon + text, never color alone per `color` guide)
        const contrastRatio = Math.max(
            tinycolor.readability(accentHex, textHex),
            tinycolor.readability(darkHex, textHex)
        );
        const ratioRounded = contrastRatio.toFixed(1);
        if (contrastRatio >= 7) {
            editorContrastBadge.classList.remove("is-warning");
            editorContrastIcon.textContent = "✓";
            editorContrastText.textContent = `${ratioRounded}:1 · AAA`;
        } else if (contrastRatio >= 4.5) {
            editorContrastBadge.classList.remove("is-warning");
            editorContrastIcon.textContent = "✓";
            editorContrastText.textContent = `${ratioRounded}:1 · AA`;
        } else {
            editorContrastBadge.classList.add("is-warning");
            editorContrastIcon.textContent = "⚠";
            editorContrastText.textContent = `${ratioRounded}:1 · Low Contrast`;
        }

        // Apply all 12 tokens to the native simulator frame
        for (const def of EDITOR_TOKEN_DEFS) {
            const val = (editorTokenState[def.key] || def.defaultVal).trim();
            const cleanVal = (def.key === "--browser-logo-filter" && (val === '""' || val === "''" || !val))
                ? "none"
                : val;
            editorBrowserFrame.style.setProperty(def.key, cleanVal);
            editorBrowserFrame.style.setProperty(def.simProp, cleanVal);
        }

        // Update generated CSS output box
        const cssText = generateEditorCssText();
        editorCssOutput.textContent = cssText;
        editorCssByteCount.textContent = `${new Blob([cssText]).size} bytes · CSS`;

        if (isEditorStorePreviewActive) {
            applyEditorStoreLiveStyle();
            updatePreviewBanner();
        }
    }

    function buildEditorTokenControls() {
        editorTokensList.innerHTML = "";
        editorControlRefs.clear();

        for (const def of EDITOR_TOKEN_DEFS) {
            const row = document.createElement("div");
            row.className = "editor-token-row";
            row.dataset.tokenKey = def.key;

            const inputId = `editor-token-${def.key.replace(/^--/, "")}`;
            const label = document.createElement("label");
            label.className = "editor-token-label";
            label.setAttribute("for", inputId);

            const friendlySpan = document.createElement("span");
            friendlySpan.className = "editor-token-friendly";
            friendlySpan.textContent = def.label;

            const propCode = document.createElement("code");
            propCode.className = "editor-token-prop";
            propCode.textContent = def.key;

            label.append(friendlySpan, propCode);

            const controlsWrap = document.createElement("div");
            controlsWrap.className = "editor-token-controls";

            let colorInput = null;
            if (def.isColor) {
                colorInput = document.createElement("input");
                colorInput.type = "color";
                colorInput.className = "editor-color-picker";
                colorInput.setAttribute("aria-label", `${def.label} color picker`);
                colorInput.value = resolveTokenToHex(editorTokenState[def.key]);
                controlsWrap.appendChild(colorInput);
            }

            const textInput = document.createElement("input");
            textInput.type = "text";
            textInput.id = inputId;
            textInput.name = def.key;
            textInput.className = "editor-text-input editor-token-input";
            textInput.setAttribute("autocorrect", "off");
            textInput.setAttribute("autocapitalize", "off");
            textInput.setAttribute("spellcheck", "false");
            textInput.value = editorTokenState[def.key] || def.defaultVal;
            controlsWrap.appendChild(textInput);

            row.append(label, controlsWrap);

            if (Array.isArray(def.presets) && def.presets.length > 0) {
                const presetsBar = document.createElement("div");
                presetsBar.className = "editor-filter-presets";
                for (const preset of def.presets) {
                    const chip = document.createElement("button");
                    chip.type = "button";
                    chip.className = "editor-filter-chip";
                    chip.textContent = preset.label;
                    chip.addEventListener("click", () => {
                        textInput.value = preset.value.trim();
                        editorTokenState[def.key] = textInput.value;
                        updateEditorLiveState();
                    });
                    presetsBar.appendChild(chip);
                }
                row.appendChild(presetsBar);
            }

            const syncFromText = () => {
                editorTokenState[def.key] = textInput.value.trim() || def.defaultVal;
                // Sync all color pickers in case another token references this one via var()
                for (const [k, refs] of editorControlRefs.entries()) {
                    if (refs.colorInput) {
                        refs.colorInput.value = resolveTokenToHex(editorTokenState[k]);
                    }
                }
                updateEditorLiveState();
            };

            textInput.addEventListener("input", syncFromText);
            textInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.isComposing) {
                    e.preventDefault();
                    syncFromText();
                }
            });

            if (colorInput) {
                colorInput.addEventListener("input", () => {
                    textInput.value = colorInput.value;
                    syncFromText();
                });
            }

            editorControlRefs.set(def.key, { textInput, colorInput });
            editorTokensList.appendChild(row);
        }
    }

    function applyTokensToEditorInputs(tokensObj, meta = {}) {
        if (meta.name !== undefined) editorMetaName.value = meta.name;
        if (meta.author !== undefined) editorMetaAuthor.value = meta.author;
        if (meta.version !== undefined) editorMetaVersion.value = meta.version;

        const baseDefaults = EDITOR_PRESETS["default-dark"].tokens;
        for (const def of EDITOR_TOKEN_DEFS) {
            const nextVal = tokensObj?.[def.key] ?? baseDefaults[def.key] ?? def.defaultVal;
            editorTokenState[def.key] = nextVal;
            const refs = editorControlRefs.get(def.key);
            if (refs) {
                refs.textInput.value = nextVal;
            }
        }
        for (const [k, refs] of editorControlRefs.entries()) {
            if (refs.colorInput) {
                refs.colorInput.value = resolveTokenToHex(editorTokenState[k]);
            }
        }
        updateEditorLiveState();
    }

    async function loadEditorPresetSelection(presetValue, { announce = true } = {}) {
        if (EDITOR_PRESETS[presetValue]) {
            const p = EDITOR_PRESETS[presetValue];
            applyTokensToEditorInputs(p.tokens, { name: p.name, author: p.author, version: p.version });
            if (announce) showToast(`Initialized "${p.name}" style values`);
            return;
        }
        if (presetValue.startsWith("theme:")) {
            const slug = presetValue.slice("theme:".length);
            const theme = themes.find(t => t.slug === slug);
            if (!theme) return;
            await hydrateThemeCss(theme);
            const t = theme.parsed.tokens;
            const merged = {
                "--browser-accent-color": t["--browser-accent-color"] || theme.accent,
                "--browser-accent-color-dark": t["--browser-accent-color-dark"] || t["--browser-accent-color"] || theme.accent,
                "--browser-active-icon-color": t["--browser-active-icon-color"] || "hsl(210deg 3% 45%)",
                "--browser-ntp-color": t["--browser-ntp-color"] || "var(--browser-accent-color)",
                "--browser-icon-color": t["--browser-icon-color"] || "#cccccc",
                "--browser-logo-filter": t["--browser-logo-filter"] || "none",
                "--browser-search-highlight-color": t["--browser-search-highlight-color"] || "rgb(255 255 255 / 10%)",
                "--browser-tab-divider-color": t["--browser-tab-divider-color"] || t["--browser-accent-color"] || "#4a4d51",
                "--browser-tab-highlight-color": t["--browser-tab-highlight-color"] || t["--browser-accent-color-dark"] || "#292b2e",
                "--browser-tab-strip": t["--browser-tab-strip"] || "var(--browser-accent-color-dark)",
                "--browser-text-primary-color": t["--browser-text-primary-color"] || "#ffffff",
                "--browser-text-secondary-color": t["--browser-text-secondary-color"] || t["--browser-text-primary-color"] || "#dddddd"
            };
            applyTokensToEditorInputs(merged, {
                name: `${theme.name} Remix`,
                author: theme.author,
                version: theme.version
            });
            if (announce) showToast(`Loaded "${theme.name}" into Theme Editor`);
        }
    }

    function populateEditorCataloguePresets() {
        if (!editorCatalogueOptgroup) return;
        editorCatalogueOptgroup.innerHTML = "";
        for (const theme of themes) {
            const opt = document.createElement("option");
            opt.value = `theme:${theme.slug}`;
            opt.textContent = `${theme.name} (by ${theme.author})`;
            editorCatalogueOptgroup.appendChild(opt);
        }
    }

    function setEditorPreviewTab(tabName) {
        const isStore = tabName === "store";
        const isOmnibox = tabName === "omnibox";
        editorSceneNewtab.classList.toggle("hidden", isStore);
        editorSceneStore.classList.toggle("hidden", !isStore);
        editorOmniboxMenu.classList.toggle("hidden", !isOmnibox);
        editorSimUrlText.textContent = isStore
            ? "https://themes.lhost.dev"
            : isOmnibox
                ? "rh://themes"
                : "rh://newtab";

        for (const btn of editorTabBtns) {
            const match = btn.dataset.editorTab === tabName || (isOmnibox && btn.dataset.editorTab === "rhnewtab" && !btn.getAttribute("role"));
            btn.classList.toggle("active", btn.dataset.editorTab === tabName || (isOmnibox && btn.classList.contains("ed-chrome-tab") && btn.dataset.editorTab === "rhnewtab"));
            if (btn.getAttribute("role") === "tab") {
                btn.setAttribute("aria-selected", String(btn.dataset.editorTab === tabName));
            }
        }
    }

    function syncEditorToolbarActiveState() {
        if (!openEditorBtn) return;
        openEditorBtn.classList.toggle("is-active", isEditorOpen);
        openEditorBtn.setAttribute("aria-current", isEditorOpen ? "page" : "false");
    }

    async function openThemeEditor({ presetSlug = null, pushHistory = true, animate = true } = {}) {
        isEditorOpen = true;
        activeProfileSlug = null;
        document.title = "Theme Editor — Theme Store";
        syncEditorToolbarActiveState();

        if (editorControlRefs.size === 0) {
            buildEditorTokenControls();
            updateEditorLiveState();
        }

        if (presetSlug && themes.some(t => t.slug === presetSlug)) {
            const presetVal = `theme:${presetSlug}`;
            editorPresetSelect.value = presetVal;
            await loadEditorPresetSelection(presetVal, { announce: true });
        }

        if (pushHistory) {
            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.delete("theme");
            nextUrl.searchParams.set("editor", presetSlug || "1");
            history.pushState({ view: "editor", presetSlug }, "", nextUrl);
        }

        clearAllTransitionNames();

        const applyDomUpdate = () => {
            catalogueView.classList.add("hidden");
            profileView.classList.add("hidden");
            editorView.classList.remove("hidden");
            editorView.scrollTop = 0;
        };

        if (!animate || !document.startViewTransition) {
            applyDomUpdate();
            editorHeading.focus({ preventScroll: true });
            return;
        }

        const transition = document.startViewTransition(applyDomUpdate);
        transition.finished.finally(() => {
            editorHeading.focus({ preventScroll: true });
        });
    }

    function downloadEditorCssFile() {
        const cssFile = generateEditorCssText();
        const rawName = (editorMetaName.value || "CustomTheme").trim();
        const safeBase = rawName.replace(/[^a-z0-9-_]+/gi, "") || "CustomTheme";
        const fileName = `${safeBase}.theme.css`;
        const blob = new Blob([cssFile], { type: "text/css;charset=utf-8" });
        const uri = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = uri;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(uri);
        showToast(`Exported ${fileName}`);
    }

    async function copyEditorCssToClipboard() {
        const cssFile = generateEditorCssText();
        try {
            await navigator.clipboard.writeText(cssFile);
            showToast("Copied generated .theme.css to clipboard");
        } catch {
            showToast("Unable to access clipboard");
        }
    }

    // =========================================================================
    // View Transitions & History Routing (`same-document-transitions`)
    // =========================================================================

    function clearAllTransitionNames() {
        profileIcon.style.viewTransitionName = "";
        profileHeading.style.viewTransitionName = "";
        for (const el of document.querySelectorAll("[data-vt-active]")) {
            el.style.viewTransitionName = "";
            el.removeAttribute("data-vt-active");
        }
    }

    function tagCardForTransition(slug) {
        const card = storeContent.querySelector(`.theme-card[data-slug="${CSS.escape(slug)}"]`);
        if (!card) return null;
        const icon = card.querySelector(".theme-icon");
        const title = card.querySelector(".theme-name");
        if (icon) {
            icon.style.viewTransitionName = "theme-hero-icon";
            icon.setAttribute("data-vt-active", "true");
        }
        if (title) {
            title.style.viewTransitionName = "theme-hero-title";
            title.setAttribute("data-vt-active", "true");
        }
        return card;
    }

    function openThemeProfile(slug, { pushHistory = true, sourceCard = null, animate = true } = {}) {
        const theme = themes.find(t => t.slug === slug);
        if (!theme) return;

        const wasAlreadyInProfile = Boolean(activeProfileSlug);
        isEditorOpen = false;
        syncEditorToolbarActiveState();
        activeProfileSlug = theme.slug;
        lastSelectedSlug = theme.slug;

        if (pushHistory) {
            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.delete("editor");
            nextUrl.searchParams.set("theme", theme.slug);
            history.pushState({ view: "profile", slug: theme.slug }, "", nextUrl);
        }

        clearAllTransitionNames();

        if (!wasAlreadyInProfile && animate) {
            const cardToTag = sourceCard || storeContent.querySelector(`.theme-card[data-slug="${CSS.escape(slug)}"]`);
            if (cardToTag) {
                const icon = cardToTag.querySelector(".theme-icon");
                const title = cardToTag.querySelector(".theme-name");
                if (icon) {
                    icon.style.viewTransitionName = "theme-hero-icon";
                    icon.setAttribute("data-vt-active", "true");
                }
                if (title) {
                    title.style.viewTransitionName = "theme-hero-title";
                    title.setAttribute("data-vt-active", "true");
                }
            }
        }

        const applyDomUpdate = () => {
            // Remove card transition names inside DOM update before profile gains them
            for (const el of document.querySelectorAll("[data-vt-active]")) {
                el.style.viewTransitionName = "";
                el.removeAttribute("data-vt-active");
            }
            populateProfileView(theme);
            if (!wasAlreadyInProfile && animate) {
                profileIcon.style.viewTransitionName = "theme-hero-icon";
                profileHeading.style.viewTransitionName = "theme-hero-title";
            }
            catalogueView.classList.add("hidden");
            editorView.classList.add("hidden");
            profileView.classList.remove("hidden");
            profileView.scrollTop = 0;
        };

        if (!animate || !document.startViewTransition) {
            applyDomUpdate();
            clearAllTransitionNames();
            profileHeading.focus({ preventScroll: true });
            return;
        }

        const transition = document.startViewTransition(applyDomUpdate);
        transition.finished.finally(() => {
            clearAllTransitionNames();
            profileHeading.focus({ preventScroll: true });
        });
    }

    function returnToCatalogue({ fromPopstate = false, animate = true } = {}) {
        if (!activeProfileSlug && !isEditorOpen && !profileView.classList.contains("hidden")) {
            profileView.classList.add("hidden");
            editorView.classList.add("hidden");
            catalogueView.classList.remove("hidden");
            return;
        }

        // Deep-link back handling: if user landed directly on `?theme=...` or `?editor=...`, synthesize root history
        if (!fromPopstate) {
            if (hasInAppRootHistory) {
                history.back();
                return;
            }
            const rootUrl = new URL(window.location.href);
            rootUrl.searchParams.delete("theme");
            rootUrl.searchParams.delete("editor");
            history.pushState({ view: "list" }, "", rootUrl);
            hasInAppRootHistory = true;
        }

        const wasInEditor = isEditorOpen;
        const returningSlug = wasInEditor ? null : (activeProfileSlug || lastSelectedSlug);
        activeProfileSlug = null;
        isEditorOpen = false;
        syncEditorToolbarActiveState();
        document.title = "Theme Store";

        clearAllTransitionNames();
        if (animate && returningSlug) {
            profileIcon.style.viewTransitionName = "theme-hero-icon";
            profileHeading.style.viewTransitionName = "theme-hero-title";
        }

        const applyDomUpdate = () => {
            profileIcon.style.viewTransitionName = "";
            profileHeading.style.viewTransitionName = "";
            renderCatalogue();
            profileView.classList.add("hidden");
            editorView.classList.add("hidden");
            catalogueView.classList.remove("hidden");
            if (animate && returningSlug) {
                tagCardForTransition(returningSlug);
            }
        };

        const restoreFocus = () => {
            clearAllTransitionNames();
            const targetLink = returningSlug
                ? storeContent.querySelector(`.theme-card[data-slug="${CSS.escape(returningSlug)}"] .card-link`)
                : null;
            if (targetLink) {
                targetLink.focus({ preventScroll: true });
            } else {
                catalogueHeading.focus({ preventScroll: true });
            }
        };

        if (!animate || !document.startViewTransition) {
            applyDomUpdate();
            restoreFocus();
            return;
        }

        const transition = document.startViewTransition(applyDomUpdate);
        transition.finished.finally(restoreFocus);
    }

    // =========================================================================
    // Event Wiring
    // =========================================================================

    function syncUrlQueryParam(query) {
        const nextUrl = new URL(window.location.href);
        if (query) {
            nextUrl.searchParams.set("q", query);
        } else {
            nextUrl.searchParams.delete("q");
        }
        // When typing in search while on a profile or editor page, switch cleanly back to the list view (like chrome://extensions)
        if (activeProfileSlug || isEditorOpen) {
            nextUrl.searchParams.delete("theme");
            nextUrl.searchParams.delete("editor");
            activeProfileSlug = null;
            isEditorOpen = false;
            syncEditorToolbarActiveState();
            document.title = "Theme Store";
            profileView.classList.add("hidden");
            editorView.classList.add("hidden");
            catalogueView.classList.remove("hidden");
            hasInAppRootHistory = true;
        }
        history.replaceState({ view: "list" }, "", nextUrl);
    }

    searchInput.addEventListener("input", () => {
        const val = searchInput.value;
        searchClearBtn.classList.toggle("hidden", !val);
        document.getElementById("searchShortcutHint").classList.toggle("hidden", Boolean(val));
        syncUrlQueryParam(val);
        renderCatalogue();
    });

    searchClearBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
        searchInput.focus();
    });

    // Global `/` shortcut to focus search, `Escape` to clear/blur
    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        } else if (e.key === "Escape" && document.activeElement === searchInput) {
            if (searchInput.value) {
                searchInput.value = "";
                searchInput.dispatchEvent(new Event("input"));
            } else {
                searchInput.blur();
            }
        }
    });

    for (const chip of filterChipBtns) {
        chip.addEventListener("click", () => {
            activeFilter = chip.dataset.filter || "all";
            for (const c of filterChipBtns) {
                const isSelected = c === chip;
                c.classList.toggle("active", isSelected);
                c.setAttribute("aria-pressed", String(isSelected));
            }
            renderCatalogue();
        });
    }

    sortSelect.addEventListener("change", () => {
        activeSort = sortSelect.value;
        renderCatalogue();
    });

    activeAuthorChip.addEventListener("click", () => {
        activeAuthor = null;
        renderCatalogue();
    });

    resetFiltersBtn.addEventListener("click", () => {
        activeFilter = "all";
        activeAuthor = null;
        searchInput.value = "";
        searchClearBtn.classList.add("hidden");
        document.getElementById("searchShortcutHint").classList.remove("hidden");
        for (const c of filterChipBtns) {
            const isAll = c.dataset.filter === "all";
            c.classList.toggle("active", isAll);
            c.setAttribute("aria-pressed", String(isAll));
        }
        syncUrlQueryParam("");
        renderCatalogue();
        searchInput.focus();
    });

    // Back / Home / Breadcrumb navigation
    const handleNavigateHome = (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || (e.type === "click" && e.button !== 0)) return;
        e.preventDefault();
        if (activeProfileSlug || isEditorOpen) {
            returnToCatalogue();
        } else if (activeFilter !== "all" || activeAuthor || searchInput.value) {
            resetFiltersBtn.click();
        }
    };

    brandHomeLink.addEventListener("click", handleNavigateHome);
    breadcrumbRootLink.addEventListener("click", handleNavigateHome);
    editorBreadcrumbRootLink?.addEventListener("click", handleNavigateHome);
    relatedViewAllLink.addEventListener("click", handleNavigateHome);
    profileBackBtn.addEventListener("click", () => returnToCatalogue());
    editorBackBtn?.addEventListener("click", () => returnToCatalogue());

    openEditorBtn?.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        if (isEditorOpen) return;
        openThemeEditor({ presetSlug: activeProfileSlug || null, pushHistory: true, animate: true });
    });

    profileCustomizeBtn?.addEventListener("click", () => {
        if (!activeProfileSlug) return;
        openThemeEditor({ presetSlug: activeProfileSlug, pushHistory: true, animate: true });
    });

    themeEditorForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        downloadEditorCssFile();
    });

    for (const metaInput of [editorMetaName, editorMetaAuthor, editorMetaVersion]) {
        metaInput?.addEventListener("input", () => updateEditorLiveState());
    }

    editorPresetSelect?.addEventListener("change", () => {
        loadEditorPresetSelection(editorPresetSelect.value, { announce: true });
    });

    editorInitBtn?.addEventListener("click", () => {
        loadEditorPresetSelection(editorPresetSelect?.value || "default-dark", { announce: true });
    });

    editorImportBtn?.addEventListener("click", () => {
        editorImportFile?.click();
    });

    editorImportFile?.addEventListener("change", async () => {
        const file = editorImportFile.files?.[0];
        if (!file) return;
        try {
            const rawText = await file.text();
            const parsed = parseThemeCss(rawText, { name: file.name.replace(/(\.theme)?\.css$/i, ""), accent: "#323639" });
            const nameMatch = rawText.match(/@name\s+([^\r\n*]+)/i);
            const authorMatch = rawText.match(/@author\s+([^\r\n*]+)/i);
            const versionMatch = rawText.match(/@version\s+([^\r\n*]+)/i);
            applyTokensToEditorInputs(parsed.tokens, {
                name: nameMatch ? nameMatch[1].trim() : file.name.replace(/(\.theme)?\.css$/i, ""),
                author: authorMatch ? authorMatch[1].trim() : editorMetaAuthor.value,
                version: versionMatch ? versionMatch[1].trim() : editorMetaVersion.value
            });
            showToast(`Imported "${file.name}" into Theme Editor`);
        } catch {
            showToast("Could not read CSS file");
        } finally {
            editorImportFile.value = "";
        }
    });

    editorApplyStoreBtn?.addEventListener("click", () => {
        isEditorStorePreviewActive = !isEditorStorePreviewActive;
        if (isEditorStorePreviewActive) {
            previewThemeUrl = null;
            window.themeSettingsPage?.(null);
            applyEditorStoreLiveStyle();
            updatePreviewBanner();
            syncAllActionStates();
            showToast("Applied custom editor theme to Store UI");
        } else {
            clearLivePreview();
            showToast("Restored store theme");
        }
    });

    editorCopyCssBtn?.addEventListener("click", copyEditorCssToClipboard);
    editorCodeCopyBtn?.addEventListener("click", copyEditorCssToClipboard);
    editorExportBtn?.addEventListener("click", downloadEditorCssFile);
    editorCodeDownloadBtn?.addEventListener("click", downloadEditorCssFile);

    for (const btn of editorTabBtns) {
        btn.addEventListener("click", () => {
            setEditorPreviewTab(btn.dataset.editorTab || "rhnewtab");
        });
    }

    prevThemeBtn.addEventListener("click", () => {
        if (!activeProfileSlug || themes.length < 2) return;
        const idx = themes.findIndex(t => t.slug === activeProfileSlug);
        const prev = themes[(idx - 1 + themes.length) % themes.length];
        if (prev) openThemeProfile(prev.slug, { pushHistory: true });
    });

    nextThemeBtn.addEventListener("click", () => {
        if (!activeProfileSlug || themes.length < 2) return;
        const idx = themes.findIndex(t => t.slug === activeProfileSlug);
        const next = themes[(idx + 1) % themes.length];
        if (next) openThemeProfile(next.slug, { pushHistory: true });
    });

    // Profile Hero & Detail Actions
    profileAuthorBtn.addEventListener("click", () => {
        const current = themes.find(t => t.slug === activeProfileSlug);
        if (!current) return;
        activeAuthor = current.author;
        returnToCatalogue();
    });

    profilePreviewBtn.addEventListener("click", () => {
        const current = themes.find(t => t.slug === activeProfileSlug);
        if (current) setLivePreview(current);
    });

    profileInstallBtn.addEventListener("click", () => {
        const current = themes.find(t => t.slug === activeProfileSlug);
        if (current) handleInstallTheme(current);
    });

    previewBannerBtn.addEventListener("click", () => {
        clearLivePreview();
        showToast("Restored store theme");
    });

    for (const btn of mockupTabSwitchBtns) {
        btn.addEventListener("click", () => {
            setMockupActiveTab(btn.dataset.mockupTab || "newtab");
        });
    }

    copyUrlBtn.addEventListener("click", async () => {
        const current = themes.find(t => t.slug === activeProfileSlug);
        if (!current?.url) return;
        try {
            await navigator.clipboard.writeText(current.url);
            showToast("Copied stylesheet URL to clipboard");
        } catch {
            showToast(current.url);
        }
    });

    downloadCssBtn.addEventListener("click", async () => {
        const current = themes.find(t => t.slug === activeProfileSlug);
        if (!current) return;
        const parsed = await hydrateThemeCss(current);
        const content = parsed.rawCss || `/* ${current.name} */\n`;
        const blob = new Blob([content], { type: "text/css;charset=utf-8" });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${current.slug}.theme.css`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
        showToast(`Downloaded ${current.slug}.theme.css`);
    });

    copyCssSourceBtn.addEventListener("click", async () => {
        const current = themes.find(t => t.slug === activeProfileSlug);
        if (!current) return;
        const parsed = await hydrateThemeCss(current);
        if (!parsed.rawCss) return;
        try {
            await navigator.clipboard.writeText(parsed.rawCss);
            showToast("Copied CSS source code");
        } catch {
            showToast("Unable to access clipboard");
        }
    });

    window.addEventListener("storeInstalledChange", () => {
        syncAllActionStates();
    });

    window.addEventListener("popstate", () => {
        const params = new URLSearchParams(window.location.search);
        const q = params.get("q") || "";
        if (searchInput.value !== q) {
            searchInput.value = q;
            searchClearBtn.classList.toggle("hidden", !q);
            document.getElementById("searchShortcutHint").classList.toggle("hidden", Boolean(q));
        }

        const editorParam = params.get("editor");
        const slug = params.get("theme");
        if (editorParam) {
            const presetSlug = editorParam !== "1" && themes.some(t => t.slug === editorParam) ? editorParam : null;
            openThemeEditor({ presetSlug, pushHistory: false, animate: true });
        } else if (slug && themes.some(t => t.slug === slug)) {
            openThemeProfile(slug, { pushHistory: false, animate: true });
        } else {
            hasInAppRootHistory = true;
            returnToCatalogue({ fromPopstate: true, animate: true });
        }
    });

    // =========================================================================
    // Initialization & Catalogue Hydration
    // =========================================================================

    async function fetchThemeCatalogue() {
        try {
            const resp = await fetch(REMOTE_CATALOGUE_URL);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const json = await resp.json();
            if (Array.isArray(json?.Themes) && json.Themes.length > 0) {
                return json.Themes;
            }
        } catch {
            // Fall back to bundled data/themes.json
        }

        try {
            const fallbackResp = await fetch(LOCAL_FALLBACK_URL);
            if (!fallbackResp.ok) throw new Error(`HTTP ${fallbackResp.status}`);
            const list = await fallbackResp.json();
            return Array.isArray(list) ? list : [];
        } catch {
            return [];
        }
    }

    function isThemeVerified(item) {
        if (!item || !Object.prototype.hasOwnProperty.call(item, "verified")) return false;
        const val = item.verified;
        if (val === null || val === undefined || val === false || val === 0) return false;
        if (typeof val === "string") {
            const norm = val.trim().toLowerCase();
            return norm !== "" && norm !== "false" && norm !== "no" && norm !== "0";
        }
        return Boolean(val);
    }

    async function init() {
        const params = new URLSearchParams(window.location.search);
        if (params.has("q")) {
            const q = params.get("q") || "";
            searchInput.value = q;
            searchClearBtn.classList.toggle("hidden", !q);
            document.getElementById("searchShortcutHint").classList.toggle("hidden", Boolean(q));
        }

        const rawThemes = await fetchThemeCatalogue();
        const usedSlugs = new Set();

        themes = rawThemes.map((item) => {
            const name = item?.name || "Unnamed Theme";
            const author = item?.author || "Community";
            const version = item?.version || "0.0.1";
            const accent = item?.accent || "#323639";
            const url = item?.url || item?.src || "";
            const githubUrl = item?.githubUrl || "";
            const verified = isThemeVerified(item);
            const initialMatch = name.split("").find(ch => /[a-z0-9]/i.test(ch)) || "T";
            const icon = item?.icon || generateTextIcon(initialMatch, accent);
            const description = item?.description || synthesizeDescription(name, author, accent);
            const slug = slugify(name, usedSlugs);

            const themeObj = {
                slug,
                name,
                author,
                version,
                accent,
                url,
                githubUrl,
                verified,
                icon,
                description,
                parsed: null
            };
            themeObj.parsed = parseThemeCss("", themeObj);
            return themeObj;
        });

        if (verifiedFilterChip) {
            verifiedFilterChip.classList.toggle("hidden", !themes.some(t => t.verified));
        }

        window.themeList = themes;
        populateEditorCataloguePresets();
        buildEditorTokenControls();
        updateEditorLiveState();
        renderCatalogue();

        // Deep link directly into the native Theme Editor (`?editor=1` or `?editor=<slug>`) or a theme's App Profile (`?theme=<slug>`)
        const initialEditor = params.get("editor");
        const initialSlug = params.get("theme");
        if (initialEditor) {
            const presetSlug = initialEditor !== "1" && themes.some(t => t.slug === initialEditor) ? initialEditor : null;
            history.replaceState({ view: "editor", presetSlug }, "", window.location.href);
            openThemeEditor({ presetSlug, pushHistory: false, animate: false });
        } else if (initialSlug && themes.some(t => t.slug === initialSlug)) {
            history.replaceState({ view: "profile", slug: initialSlug }, "", window.location.href);
            openThemeProfile(initialSlug, { pushHistory: false, animate: false });
        } else {
            history.replaceState({ view: "list" }, "", window.location.href);
        }

        // Background-hydrate actual CSS variables for accurate mini-palettes & classifications
        await Promise.allSettled(
            themes.map(async (theme) => {
                await hydrateThemeCss(theme);
                const cardEl = document.querySelectorAll(`.theme-card[data-slug="${CSS.escape(theme.slug)}"]`);
                for (const el of cardEl) {
                    renderMiniPalette(el.querySelector(".mini-palette"), theme.parsed);
                }
            })
        );

        // Refresh filter view if user already selected an AMOLED/Light/Colorful filter during hydration
        if (activeFilter !== "all") {
            renderCatalogue();
        }
        if (activeProfileSlug) {
            const current = themes.find(t => t.slug === activeProfileSlug);
            if (current) populateProfileView(current);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
