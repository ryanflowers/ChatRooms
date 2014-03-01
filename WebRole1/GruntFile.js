module.exports = function(grunt) {
	grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        //src: ['public/js/**/*.js'], 
        src: [
        		'public/js/bootstrap.js', 
        		'public/js/controllers/*.js', 
        		'public/js/models/*.js',
        		'public/js/services/*.js'
    		],
        dest: 'public/js/app.js'
      }
    },
    jshint: {
      files: ['grunt.js', 'public/js/**/*.js']      
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['jshint', 'concat']);
};