let mix = require('laravel-mix');

mix
	.webpackConfig({
		stats: {
			children: true
		}
	})
	.setPublicPath('www')
	.ts('assets/app.ts', 'js/app.js')
	.sass('assets/app.scss', 'css/app.css')
	.copyDirectory('assets/fonts', 'www/fonts')
	.disableNotifications()
	.sourceMaps()
	.version();