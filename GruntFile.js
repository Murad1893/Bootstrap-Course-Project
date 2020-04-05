'use strict' //this means use strict js code

//this is a configuration based task runner
module.exports = function(grunt){

  //requiring grunt plugins to use
  require('time-grunt')(grunt)
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin' //informing that usemin will be performed by the grunt-usemin
  }) //this will take care that it will load any other nodemodules that are implied within this grunt
  //alternative would be load in each and every of the modules

  grunt.initConfig({
    //configuring the sass task
    sass : {
      dist : {
        files : {
          'css/styles.css': 'css/styles.scss'
        }
      }
    },
    watch : {
      files : 'css/*.scss', //this will keep a watch on all scss files
      tasks : ['sass'] //if any of these files are modified that the sass task is run
    },
    browserSync : {
      dev : {
        bsFiles : { //these will tell that which files need to be watched for by the browserSync
          src : [ //keeping a track of all files that we want to keep watch on
            'css/*.css',
            '*.html',
            'js/*.js'
          ]
        },
        options : {
          watchTask : true, //setting up the watch task
          server : {
            baseDir : './' //current directory set as base directory
          }
        }
      }
    },
    //copying all the files in minified form
    copy: {
      html: { //use min expects us to copy the html files to the dist too for manipulation
          files: [
          {
              //for html
              expand: true,
              dot: true,
              cwd: './',
              src: ['*.html'],
              dest: 'dist'
          }]                
      },
      fonts: {
          files: [
          {
              //for font-awesome
              expand: true,
              dot: true,
              cwd: 'node_modules/font-awesome',
              src: ['fonts/*.*'],
              dest: 'dist'
          }]
      }
    },
    //specifying that the distribution folder should be cleaned up
    clean: {
      build: {
          src: [ 'dist/']
      }
    },
    imagemin: {
      dynamic: {
          files: [{
              expand: true,                  // Enable dynamic expansion
              cwd: './',                   // Src matches are relative to this path
              src: ['img/*.{png,jpg,gif}'],   // Actual patterns to match
              dest: 'dist/'                  // Destination path prefix
          }]
      }
    },
    useminPrepare: { //this will prepare the files + configure the concat css min, uglify and all other plugins as well
      foo: {
          dest: 'dist',
          src: ['contactus.html','aboutus.html','index.html'] //all the files to minify
      },
      options: {
          flow: {
              steps: {
                  css: ['cssmin'],
                  js:['uglify']
              },
              post: {
                  css: [{ //some options specified for the css
                      name: 'cssmin',
                      //solved the configuration for the font-awesome part
                      createConfig: function (context, block) {
                      var generated = context.options.generated;
                          generated.options = {
                              keepSpecialComments: 0, rebase: false
                          };
                      }       
                  }]
              }
          }
      }
    },
    // Concat
    concat: {
      options: {
          separator: ';'
      },

      // dist configuration is provided by useminPrepare
      dist: {}
    },

    // Uglify
    uglify: {
        // dist configuration is provided by useminPrepare
        dist: {}
    },

    cssmin: {
        dist: {}
    },

    // Filerev
    filerev: { //browser when reloading our webpage may have cached it and hence may not download main.js and main.css hence webpage would not be updated. So this will avoid this by attaching a filerev number to our file
        options: {
            encoding: 'utf8',
            algorithm: 'md5',
            length: 20
        },

        release: {
        // filerev:release hashes(md5) all assets (images, js and css )
        // in dist directory
            files: [{
                src: [
                    'dist/js/*.js',
                    'dist/css/*.css',
                ]
            }]
        }
    },

    // Usemin
    // Replaces all assets with their revved version in html and css files.
    // options.assetDirs contains the directories for finding the assets
    // according to their relative paths
    usemin: {
        html: ['dist/contactus.html','dist/aboutus.html','dist/index.html'], //which files it needs to update
        options: {
            assetsDirs: ['dist', 'dist/css','dist/js'] //all the assets that we are using exists here
        }
    },

    htmlmin: {                                         // Task
        dist: {                                        // Target
            options: {                                 // Target options
                collapseWhitespace: true //all the whitespaces in the html files would be collapsed
            },
            //these files will be minified and then put back to the destination
            files: {                                   // Dictionary of files
                'dist/index.html': 'dist/index.html',  // 'destination': 'source'
                'dist/contactus.html': 'dist/contactus.html',
                'dist/aboutus.html': 'dist/aboutus.html',
            }
        }
    }
    })

  //executing the sass task
  grunt.registerTask('css',['sass']) //Task name: css and this involves executing the sass task described above

  //default this wil run this task
  //the sequence of tasks matter here
  grunt.registerTask('default',['browserSync', 'watch']) //watch task should be done at the last

  //configuring a build task here
  grunt.registerTask('build', [
    'clean',
    'copy',
    'imagemin',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ])
}