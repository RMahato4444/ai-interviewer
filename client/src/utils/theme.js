const THEME_KEY = "themePreference";


// ========================================
// DEFAULT THEME
// ========================================

export const DEFAULT_THEME = "system";


// ========================================
// GET SAVED THEME
// ========================================

export const getStoredTheme = () => {
    const stored =
        localStorage.getItem(
            THEME_KEY
        );

    if (
        stored === "light" ||
        stored === "dark" ||
        stored === "system"
    ) {
        return stored;
    }

    return DEFAULT_THEME;
};


// ========================================
// GET SYSTEM THEME
// ========================================

export const getSystemTheme = () => {
    if (
        typeof window ===
        "undefined"
    ) {
        return "light";
    }

    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches
        ? "dark"
        : "light";
};


// ========================================
// APPLY THEME
// ========================================

export const applyTheme = (
    theme
) => {

    const resolvedTheme =
        theme === "system"
            ? getSystemTheme()
            : theme;


    const root =
        document.documentElement;


    root.classList.toggle(
        "dark",
        resolvedTheme === "dark"
    );


    root.dataset.theme =
        resolvedTheme;


    root.style.colorScheme =
        resolvedTheme;


    return resolvedTheme;
};


// ========================================
// SAVE + APPLY THEME
// ========================================

export const setTheme = (
    theme
) => {

    localStorage.setItem(
        THEME_KEY,
        theme
    );

    applyTheme(theme);
};


// ========================================
// INITIALIZE THEME
// ========================================

export const initializeTheme =
    () => {

        const theme =
            getStoredTheme();

        applyTheme(theme);
    };