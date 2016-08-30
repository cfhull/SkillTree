var gulp = require('gulp'),     
	elixir = require('laravel-elixir');

var directories = {
	'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js': 'public/js/lib',
	'node_modules/d3/build/d3.min.js': 'public/js/lib',
	'node_modules/d3-tip/index.js': 'public/js/lib',
	'node_modules/d3-svg-legend/d3-legend.min.js': 'public/js/lib',
	'node_modules/jquery/dist/jquery.min.js': 'public/js/lib'
}

elixir(function(mix) {
	mix.sass('style.scss');
	
	for (directory in directories) {
		mix.copy(directory, directories[directory]);
	}

	mix.copy('resources/assets/js', 'public/js');

	mix.copy('node_modules/bootstrap-sass/assets/fonts', 'public/fonts');	
});
