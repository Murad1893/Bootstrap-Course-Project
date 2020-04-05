'use strict' //this means use strict js code

//this is a configuration based task runner
module.exports = function(grunt){

  //requiring grunt plugins to use
  require('time-grunt')(grunt)
  require('jit-grunt')(grunt) //this will take care that it will load any other nodemodules that are implied within this grunt
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
  })

  //executing the sass task
  grunt.registerTask('css',['sass']) //Task name: css and this involves executing the sass task described above
  grunt.registerTask('default',['browserSync', 'watch']) //watch task should be done at the last
}