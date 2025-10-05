/**
 * Simple breadcrumb generator
 * Add data-breadcrumb attribute to any element to auto-generate breadcrumbs
 * Example: <nav data-breadcrumb></nav>
 */

document.addEventListener('DOMContentLoaded', function () {
	const breadcrumbContainers = document.querySelectorAll('[data-breadcrumb]');

	if (breadcrumbContainers.length === 0) return;

	const path = window.location.pathname;
	const segments = path.split('/').filter((segment) => segment);

	// Remove index.html if present
	if (segments[segments.length - 1] === 'index.html') {
		segments.pop();
	}

	breadcrumbContainers.forEach((container) => {
		const breadcrumbNav = document.createElement('nav');
		breadcrumbNav.setAttribute('aria-label', 'breadcrumb');

		const ol = document.createElement('ol');
		ol.className = 'breadcrumb';

		// Home link
		const homeLi = document.createElement('li');
		homeLi.className = 'breadcrumb-item';
		const homeLink = document.createElement('a');
		homeLink.href = '/';
		homeLink.textContent = 'Home';
		homeLi.appendChild(homeLink);
		ol.appendChild(homeLi);

		// Build breadcrumb trail
		let currentPath = '';
		segments.forEach((segment, index) => {
			currentPath += '/' + segment;
			const li = document.createElement('li');

			// Remove .html extension for display
			const displayName = segment.replace('.html', '');
			// Capitalize and replace dashes/underscores with spaces
			const formattedName = displayName
				.replace(/[-_]/g, ' ')
				.replace(/\b\w/g, (l) => l.toUpperCase());

			if (index === segments.length - 1) {
				// Last item - no link
				li.className = 'breadcrumb-item active';
				li.setAttribute('aria-current', 'page');
				li.textContent = formattedName;
			} else {
				// Intermediate items - with link
				li.className = 'breadcrumb-item';
				const link = document.createElement('a');
				link.href = currentPath;
				link.textContent = formattedName;
				li.appendChild(link);
			}

			ol.appendChild(li);
		});

		breadcrumbNav.appendChild(ol);
		container.appendChild(breadcrumbNav);
	});
});
