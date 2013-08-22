module.exports = function( grunt ) {

   "use strict";

   var readOptionalJSON = function( filepath ) {
      var data = {};
      try {
         data = grunt.file.readJSON( filepath );
      } catch(e) {}
      return data;
   },
   srcHintOptions = readOptionalJSON( ".jshintrc" );

   grunt.initConfig({
      pkg: grunt.file.readJSON("package.json"),
      concat: {
        scandio: {
          options: {
            separator: ""
          },
          src: [
            "js/index.js",
            "js/logger.js",
            "js/util.js",
            "js/string.js",
            "js/timing.js",
            "js/is.js",
            "js/ajax.js",
            "js/core.js",
            "js/confluence.js",
            "js/responsive.js",
            "js/dom.js",
            "js/outro.js"
          ],
          dest: "dist/scandio-<%= pkg.version %>.js"
        }
      },
      jsonlint: {
         pkg: {
            src: [ "package.json" ]
         },
         bower: {
            src: [ "bower.json" ]
         }
      },
      jshint: {
         dist: {
            src: [ "dist/scandio-<%= pkg.version %>.js" ],
            options: srcHintOptions
         },
         grunt: {
            src: [ "Gruntfile.js" ],
            options: {
               jshintrc: ".jshintrc"
            }
         }
      },
      uglify: {
         all: {
            files: {
               "dist/scandio-<%= pkg.version %>.min.js": [ "dist/scandio-<%= pkg.version %>.js" ]
            },
            options: {
               preserveComments: "some",
               sourceMap: "dist/scandio-<%= pkg.version %>.min.map",
               sourceMappingURL: "scandio-<%= pkg.version %>.min.map",
               beautify: {
                  ascii_only: true
               },
               compress: {
                  hoist_funs: false,
                  join_vars: false,
                  loops: false,
                  unused: false
               },
               mangle: {
                  except: [ "undefined" ]
               }
            }
         }
      },
      copy: {
         main: {
            files: [
               {src: "dist/scandio-<%= pkg.version %>.js", dest: "dist/scandio.js"},
               {src: "dist/scandio-<%= pkg.version %>.min.js", dest: "dist/scandio.min.js"},
               {src: "dist/scandio-<%= pkg.version %>.min.map", dest: "dist/scandio.min.map"}
            ]
         }
      },
      docco: {
         docs: {
            src: ['src/*js', 'dist/scandio-<%= pkg.version %>.js'],
            options: {
               output: 'docs'
            }
         }
      },
      jstestdriver: {
         files: ["jsTestDriver.conf"]
      },
      testem: {
          options : {
            launch_in_ci : [
              'chrome',
              'safari'
            ]
          },
          main : {
            src: ['testem.json'],
            dest: 'test/testem.tap'
          }
        }
   });

   grunt.loadNpmTasks("grunt-contrib-jshint");
   grunt.loadNpmTasks("grunt-jsonlint");
   grunt.loadNpmTasks("grunt-contrib-concat");
   grunt.loadNpmTasks("grunt-contrib-uglify");
   grunt.loadNpmTasks('grunt-docco2');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-jstestdriver');
   grunt.loadNpmTasks('grunt-testem');

   grunt.registerTask( "test-driver", ["jsonlint", "concat", "jshint", "uglify", "copy", "jstestdriver"] );
   grunt.registerTask( "test-em", ["jsonlint", "concat", "jshint", "uglify", "copy", "testem"] );

   grunt.registerTask( "dist", ["jsonlint", "concat", "jshint", "uglify", "copy", "docco"] );
};