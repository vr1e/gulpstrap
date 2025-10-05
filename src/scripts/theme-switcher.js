/**
 * Runtime Theme Switcher
 * Dynamically loads theme CSS and persists preference to localStorage
 */

(function () {
	'use strict';

	const STORAGE_KEY = 'gulpstrap-theme';
	const DEFAULT_THEME = 'theme1';
	const THEMES = {
		whitelabel: {
			name: 'Whitelabel',
			file: '/styles/themes/main-whitelabel.css'
		},
		theme1: {
			name: 'Theme 1',
			file: '/styles/themes/main-theme1.css'
		},
		'theme1-dark': {
			name: 'Theme 1 Dark',
			file: '/styles/themes/main-theme1-dark.css'
		}
	};

	/**
	 * Get current theme from localStorage or default
	 */
	function getCurrentTheme() {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored && THEMES[stored] ? stored : DEFAULT_THEME;
	}

	/**
	 * Load theme CSS file
	 */
	function loadTheme(themeId) {
		const theme = THEMES[themeId];
		if (!theme) {
			console.error(`Theme "${themeId}" not found`);
			return;
		}

		// Remove existing theme stylesheet
		const existingLink = document.getElementById('theme-stylesheet');
		if (existingLink) {
			existingLink.remove();
		}

		// Create and append new theme stylesheet
		const link = document.createElement('link');
		link.id = 'theme-stylesheet';
		link.rel = 'stylesheet';
		link.href = theme.file;

		// Insert before the first stylesheet or at the end of head
		const firstLink = document.querySelector('link[rel="stylesheet"]');
		if (firstLink) {
			firstLink.parentNode.insertBefore(link, firstLink);
		} else {
			document.head.appendChild(link);
		}

		// Set Bootstrap color mode on body for dark themes
		const isDarkTheme = themeId.includes('dark');
		if (isDarkTheme) {
			document.body.setAttribute('data-bs-theme', 'dark');
		} else {
			document.body.removeAttribute('data-bs-theme');
		}

		// Save to localStorage
		localStorage.setItem(STORAGE_KEY, themeId);

		// Dispatch event for components that need to react to theme changes
		document.dispatchEvent(
			new CustomEvent('themeChanged', {
				detail: { themeId, themeName: theme.name }
			})
		);
	}

	/**
	 * Switch to a different theme
	 */
	function switchTheme(themeId) {
		if (!THEMES[themeId]) {
			console.error(`Theme "${themeId}" not available`);
			return;
		}
		loadTheme(themeId);
	}

	/**
	 * Get list of available themes
	 */
	function getAvailableThemes() {
		return Object.keys(THEMES).map((id) => ({
			id,
			name: THEMES[id].name,
			active: id === getCurrentTheme()
		}));
	}

	// Auto-load theme on page load
	document.addEventListener('DOMContentLoaded', function () {
		const currentTheme = getCurrentTheme();
		loadTheme(currentTheme);
	});

	// Export to global scope for easy access
	window.ThemeSwitcher = {
		switchTheme,
		getCurrentTheme,
		getAvailableThemes,
		themes: THEMES
	};
})();
