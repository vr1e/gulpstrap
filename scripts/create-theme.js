#!/usr/bin/env node

/**
 * Theme Generator CLI
 * Creates a new theme based on an existing parent theme
 * Usage: npm run create-theme <theme-name> [parent-theme]
 */

const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '../src/styles/themes');
const AVAILABLE_THEMES = ['whitelabel', 'theme1', 'theme1-dark'];

/**
 * Validate theme name
 */
function validateThemeName(name) {
	if (!name || name.trim() === '') {
		return 'Theme name is required';
	}

	if (!/^[a-z0-9-]+$/.test(name)) {
		return 'Theme name must contain only lowercase letters, numbers, and hyphens';
	}

	if (fs.existsSync(path.join(THEMES_DIR, name))) {
		return `Theme "${name}" already exists`;
	}

	return null;
}

/**
 * Create theme directory and files
 */
function createTheme(themeName, parentTheme = 'whitelabel') {
	const themeDir = path.join(THEMES_DIR, themeName);
	const parentDir = path.join(THEMES_DIR, parentTheme);

	// Validate parent theme exists
	if (!fs.existsSync(parentDir)) {
		console.error(`❌ Parent theme "${parentTheme}" does not exist`);
		console.log(`   Available themes: ${AVAILABLE_THEMES.join(', ')}`);
		process.exit(1);
	}

	// Create theme directory
	fs.mkdirSync(themeDir, { recursive: true });

	// Create base directory if parent has one
	const parentBaseDir = path.join(parentDir, 'base');
	if (fs.existsSync(parentBaseDir)) {
		fs.mkdirSync(path.join(themeDir, 'base'), { recursive: true });
	}

	// Create _variables.scss
	const variablesContent = `// ${themeName} - Bootstrap variable overrides
// Inherits from ${parentTheme}
@import '../${parentTheme}/variables';

// Add your variable overrides here
// Example:
// $primary: #007bff;
// $secondary: #6c757d;
`;
	fs.writeFileSync(path.join(themeDir, '_variables.scss'), variablesContent);

	// Create _styles.scss
	const stylesContent = `// ${themeName} - Custom theme styles
// Add your custom styles here

// Example:
// .custom-component {
//   background-color: $primary;
//   color: white;
// }
`;
	fs.writeFileSync(path.join(themeDir, '_styles.scss'), stylesContent);

	// Create base/_colors.scss if parent has one
	if (fs.existsSync(path.join(parentBaseDir, '_colors.scss'))) {
		const colorsContent = `// ${themeName} - Color definitions
@import '../../${parentTheme}/base/colors';

// Add your color overrides here
`;
		fs.writeFileSync(path.join(themeDir, 'base/_colors.scss'), colorsContent);
	}

	// Create base/_typography.scss if parent has one
	if (fs.existsSync(path.join(parentBaseDir, '_typography.scss'))) {
		const typographyContent = `// ${themeName} - Typography definitions
@import '../../${parentTheme}/base/typography';

// Add your typography overrides here
`;
		fs.writeFileSync(path.join(themeDir, 'base/_typography.scss'), typographyContent);
	}

	// Create base/index.scss if parent has base directory
	if (fs.existsSync(parentBaseDir)) {
		const baseIndexContent = `// ${themeName} - Base styles index
@import 'colors';
@import 'typography';
`;
		fs.writeFileSync(path.join(themeDir, 'base/index.scss'), baseIndexContent);
	}

	// Create index.scss - complete theme entry point
	const parentChain = getParentChain(parentTheme);
	let indexContent = `// ${themeName} - Complete theme with Bootstrap\n\n`;

	// 1. Import Bootstrap functions first
	indexContent += `// 1. Import Bootstrap functions first\n`;
	indexContent += `@import 'node_modules/bootstrap/scss/functions';\n\n`;

	// 2. Import variables in order
	indexContent += `// 2. Import variables in inheritance order\n`;
	parentChain.forEach((parent) => {
		indexContent += `@import '../${parent}/variables';\n`;
	});
	indexContent += `@import 'variables';\n\n`;

	// 3. Import Bootstrap core
	indexContent += `// 3. Import Bootstrap core\n`;
	indexContent += `@import '../../vendors/bootstrap/bootstrap';\n\n`;

	// 4. Import styles in order
	indexContent += `// 4. Import styles in inheritance order\n`;
	parentChain.forEach((parent) => {
		if (fs.existsSync(path.join(THEMES_DIR, parent, 'base'))) {
			indexContent += `@import '../${parent}/base';\n`;
		}
		indexContent += `@import '../${parent}/styles';\n`;
	});

	// Import current theme styles
	if (fs.existsSync(path.join(themeDir, 'base'))) {
		indexContent += `@import 'base';\n`;
	}
	indexContent += `@import 'styles';\n`;

	fs.writeFileSync(path.join(themeDir, 'index.scss'), indexContent);

	console.log(`✅ Theme "${themeName}" created successfully!`);
	console.log(`   Location: src/styles/themes/${themeName}/`);
	console.log(`   Parent: ${parentTheme}`);
	console.log('\n📁 Created files:');
	console.log(`   - _variables.scss`);
	console.log(`   - _styles.scss`);
	console.log(`   - index.scss`);
	if (fs.existsSync(path.join(themeDir, 'base'))) {
		console.log(`   - base/_colors.scss`);
		console.log(`   - base/_typography.scss`);
		console.log(`   - base/index.scss`);
	}
	console.log('\n🎨 Next steps:');
	console.log(
		`   1. Edit src/styles/themes/${themeName}/_variables.scss to customize Bootstrap variables`
	);
	console.log(`   2. Edit src/styles/themes/${themeName}/_styles.scss to add custom styles`);
	console.log(`   3. Update gulpfile.js compileAllThemes() to include "${themeName}"`);
	console.log(`   4. Update src/scripts/theme-switcher.js to add "${themeName}" to THEMES object`);
	console.log(`   5. Run "npm start" or "npm run build" to compile the theme`);
}

/**
 * Get parent chain for a theme
 */
function getParentChain(theme) {
	const chain = [];
	const themeHierarchy = {
		'theme1-dark': 'theme1',
		theme1: 'whitelabel',
		whitelabel: null
	};

	let current = theme;
	while (current) {
		chain.unshift(current);
		current = themeHierarchy[current];
	}

	return chain;
}

// CLI Logic
const args = process.argv.slice(2);
const themeName = args[0];
const parentTheme = args[1] || 'whitelabel';

if (!themeName) {
	console.log('🎨 Gulpstrap Theme Generator\n');
	console.log('Usage: npm run create-theme <theme-name> [parent-theme]\n');
	console.log('Examples:');
	console.log('  npm run create-theme my-theme');
	console.log('  npm run create-theme my-dark-theme theme1');
	console.log(`\nAvailable parent themes: ${AVAILABLE_THEMES.join(', ')}`);
	console.log('Default parent: whitelabel');
	process.exit(0);
}

const validationError = validateThemeName(themeName);
if (validationError) {
	console.error(`❌ ${validationError}`);
	process.exit(1);
}

createTheme(themeName, parentTheme);
