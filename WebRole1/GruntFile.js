module.exports = function(grunt) {
	grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['public/js/**/*.js'],
        dest: 'public/js/app.js'
      }
    },
    jshint: {
      files: ['grunt.js', 'public/js/**/*.js']      //TODO: Specify or in dependacies here
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