"use strict";

module.exports = function (grunt) {

  grunt.initConfig({

    mochaTest: {
      options: {
        reporter: 'spec',
        clearRequireCache: false
      },
      src: ['test/**/*.js']
    },

    jshint: {
      files: ['gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: true,
        force: true
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'mochaTest'],
      options: {
        spawn: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['jshint', 'mochaTest', 'watch']);

};
