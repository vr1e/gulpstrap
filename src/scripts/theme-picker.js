/**
 * Theme Picker UI Component
 * Auto-generates a Bootstrap 5.3+ dropdown theme selector
 * Add data-theme-picker attribute to any element to render the picker
 *
 * Uses Bootstrap components:
 * - .dropdown wrapper
 * - .btn.dropdown-toggle button
 * - .dropdown-menu with .dropdown-item options
 * - data-bs-toggle="dropdown" for Bootstrap JS initialization
 * - data-bs-theme="dark" for dark mode (Bootstrap 5.3+ color modes)
 */

document.addEventListener('DOMContentLoaded', function () {
	const pickerContainers = document.querySelectorAll('[data-theme-picker]');

	if (pickerContainers.length === 0 || !window.ThemeSwitcher) return;

	pickerContainers.forEach((container) => {
		const themes = window.ThemeSwitcher.getAvailableThemes();
		const currentTheme = window.ThemeSwitcher.getCurrentTheme();

		// Create dropdown wrapper
		const dropdown = document.createElement('div');
		dropdown.className = 'dropdown';

		// Create dropdown button
		const button = document.createElement('button');
		button.className = 'btn btn-outline-info dropdown-toggle';
		button.type = 'button';
		button.id = 'themePickerDropdown';
		button.setAttribute('data-bs-toggle', 'dropdown');
		button.setAttribute('aria-expanded', 'false');

		const currentThemeName = themes.find((t) => t.id === currentTheme)?.name || 'Select Theme';
		button.innerHTML = `<i class="fas fa-palette"></i> ${currentThemeName}`;

		// Create dropdown menu
		// Note: Color mode is controlled by data-bs-theme on <body>, so dropdown inherits it automatically
		const menu = document.createElement('ul');
		menu.className = 'dropdown-menu';
		menu.setAttribute('aria-labelledby', 'themePickerDropdown');

		// Add theme options
		themes.forEach((theme) => {
			const li = document.createElement('li');
			const a = document.createElement('a');
			a.className = 'dropdown-item' + (theme.active ? ' active' : '');
			a.href = '#';
			a.textContent = theme.name;

			a.addEventListener('click', (e) => {
				e.preventDefault();
				window.ThemeSwitcher.switchTheme(theme.id);

				// Update button text
				button.innerHTML = `<i class="fas fa-palette"></i> ${theme.name}`;

				// Update active state
				menu.querySelectorAll('.dropdown-item').forEach((item) => {
					item.classList.remove('active');
				});
				a.classList.add('active');
			});

			li.appendChild(a);
			menu.appendChild(li);
		});

		dropdown.appendChild(button);
		dropdown.appendChild(menu);
		container.appendChild(dropdown);
	});

	// Listen for theme changes and update pickers
	document.addEventListener('themeChanged', function (e) {
		const themeName = e.detail.themeName;

		// Update button text
		document.querySelectorAll('[data-theme-picker] button').forEach((button) => {
			button.innerHTML = `<i class="fas fa-palette"></i> ${themeName}`;
		});

		// Note: Dropdown color mode is automatically inherited from <body data-bs-theme>
		// set by theme-switcher.js, so no need to manually update it here
	});
});
