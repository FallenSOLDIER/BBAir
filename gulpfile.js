    // Core
var gulp = require('gulp'),

    // Stylesheets
    sass = require('gulp-ruby-sass'),

    // Stylesheet Tools
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    autoprefix = require('gulp-autoprefixer'),

    // Javascript
    ts = require('gulp-typescript'),

    // Javascript Tools
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),

    // File Related
    rename = require('gulp-rename'),
    del = require('del'),

    // Archive
    zip = require('gulp-zip'),
    unzip = require('gulp-unzip'),
    tar = require('gulp-tar'),
    gzip = require('gulp-gzip'),

    // Misc
    notify = require("gulp-notify");

// Utility Functions

// Concatenates a path from a series of folders
function makePath(paths)
{
    var path = "";

    for(var i = 0; i < paths.length; i++)
    {
        if(i == 0) path = paths[i];
        else path = path + '/' + paths[i];
    }

    return path;
}

// Adds the common ./ prefix typically found on all paths
// Leave path to empty string for jsut the prefix
function prefixPath(path)
{
    return './' + path;
}

// Adds the common /**/*.[ext] typically found on all paths
// meaining 'copy this folder and all subfolders and files'
// Leave path empty string for just suffix, leave ext empty
// string for all files
function suffixPath(path, ext)
{
    // If ext not specified search for all files with or without extension in all folders
    // If ext specified search only for the files with that extension or with any extension
    // But extension is required if ext is specified
    _ext = "";
    if(ext) _ext = "." + ext;
    return path + '/**/*' + _ext;
}

// Does both, prefixes and suffixes path
function fixPath(path, ext)
{
    return prefixPath(path) + suffixPath('', ext);
}

// Goes through an array of paths and prefixes
// them and suffixes them returning new array
// As a shortcut, there must be an equal number
// of paths and exts, each path directly maps to its
// associated ext
function fixPaths(paths, exts)
{
    var newArr = [];

    for(var i = 0; i < paths.length; i++)
    {
        newArr.push(fixPath(paths[i], exts[i]));
    }

    return newArr;
}

// Goes through an array of paths and prefixes
// them returning new array.
function prefixPaths(paths)
{
    var newArr = [];

    for(var i = 0; i < paths.length; i++)
    {
        newArr.push(prefixPath(paths[i]));
    }

    return newArr;
}

// Goes through an array of paths and suffixes
// them returning new array. As a shortcut, there 
// must be an equal number of paths and exts, 
// each path directly maps to its associated ext
function suffixPaths(paths, exts)
{
    var newArr = [];

    for(var i = 0; i < paths.length; i++)
    {
        newArr.push(suffixPath(paths[i]));
    }

    return newArr;
}

// Goes through an array of paths and fixes
// them according to select then returns new array
// As a shortcut, there must be an equal number
// of paths, exts, and selects each path is directly 
// mapped to its ext and select
// Select can be one of prefix, suffix, or both
// if its any other its skipped all-together and
// excluded from the array
function autofixPaths(selects, paths, exts)
{
    var newArr = [];

    for(var i = 0; i < paths.length; i++)
    {
        var select = selects[i];
        if(select == 'prefix') newArr.push(prefixPath(paths[i]));
        else if(select == 'suffix') newArr.push(sufixPath(paths[i], exts[i]));
        else if(select == 'both') newArr.push(sufixPath(paths[i], exts[i]));

        // Specifically skip this path all-together
        // can be useful
        else continue;
    }

    return newArr;
}

var config =
{
    appFolder: 'app',

    // App Folder Folder Mapping
    appFolderLayout:
    {
         // Not processed at all
        raw: 'basic',

        // Scripting Related
        javascript: 'scripts',
        typescript: 'scripts',

        // Style Related
        css: 'styles',
        sass: 'styles',

        // Media Related
        mediaEn: 'media/media-en',
        mediaAll: 'media/media-universal',

        // Template
        template: 'templates'
    },

    buildFolder: "build",

    buildFolderLayout:
    {
        fonts: 'fonts',
        minify: 'minify',
        styles: 'styles',
        scripts: 'scripts',

        template: "template",
        prep: "prep",
        archives: "archives"
    },

    nodeJsFolder: 'node_modules',
    bowerFolder: 'bower_components',

    libraries:
    {
        js:
        [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/modernizr/modernizr.js',
            'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js'
        ],

        css:
        [
        ]
    },

    cleaning:
    {
        // def is the only one that converts to just the bare clean command
        def: ['build']
    }
};

function getDir(path, prefix, ext)
{
    if(prefix) return prefixPath(path);
    else return fixPath(path, ext);
}

function getDirAppRaw(prefix, ext)
{
    var path = makePath([config.appFolder, config.appFolderLayout.raw]);
    return getDir(path, prefix, ext);
}

function getDirAppJS(prefix, ext)
{
    var path = makePath([config.appFolder, config.appFolderLayout.javascript]);
    return getDir(path, prefix, ext);
}

function getDirAppTS(prefix, ext)
{
    var path = makePath([config.appFolder, config.appFolderLayout.typescript]);
    return getDir(path, prefix, ext);
}

function getDirAppCSS(prefix, ext)
{
    var path = makePath([config.appFolder, config.appFolderLayout.css]);
    return getDir(path, prefix, ext);
}

function getDirAppSASS(prefix, ext)
{
    var path = makePath([config.appFolder, config.appFolderLayout.sass]);
    return getDir(path, prefix, ext);
}

function getDirAppTemplate(prefix, ext)
{
    var path = makePath([config.appFolder, config.appFolderLayout.template]);
    return getDir(path, prefix, ext);
}

function getDirAppMediaAll(prefix, ext)
{
    var path = makePath([config.appFolder, config.appFolderLayout.mediaAll]);
    return getDir(path, prefix, ext);
}

function getDirAppMediaEn(prefix, ext)
{
    var path = makePath([config.appFolder, config.appFolderLayout.mediaEn]);
    return getDir(path, prefix, ext);
}

function getDirBuildFonts(prefix, ext)
{
    var path = makePath([config.buildFolder, 
                            config.buildFolderLayout.fonts]);
    return getDir(path, prefix, ext);
}

function getDirBuildMinify(prefix, ext)
{
    var path = makePath([config.buildFolder, 
                            config.buildFolderLayout.minify]);
    return getDir(path, prefix, ext);
}

function getDirBuildStyles(prefix, ext)
{
    var path = makePath([config.buildFolder, 
                            config.buildFolderLayout.styles]);
    return getDir(path, prefix, ext);
}

function getDirBuildScripts(prefix, ext)
{
    var path = makePath([config.buildFolder, 
                            config.buildFolderLayout.scripts]);
    return getDir(path, prefix, ext);
}

function getDirBuildArchives(prefix, ext)
{
    var path = makePath([config.buildFolder, config.buildFolderLayout.archives]);
    return getDir(path, prefix, ext);
}

function getDirBuildPrep(prefix, ext)
{
    var path = makePath([config.buildFolder, config.buildFolderLayout.prep]);
    return getDir(path, prefix, ext);
}

function getDirBuildTemplate(prefix, ext)
{
    var path = makePath([config.buildFolder, config.buildFolderLayout.template]);
    return getDir(path, prefix, ext);
}

function getDirNode(prefix, ext)
{
    var path = makePath([config.nodeJsFolder]);
    return getDir(path, prefix, ext);
}

function getDirBower(prefix, ext)
{
    var path = makePath([config.bowerFolder]);
    return getDir(path, prefix, ext);
}

function libJs(libs)
{
    return config.libraries.js.concat(libs);
}

function libCss(libs)
{
    return config.libraries.css.concat(libs);
}

gulp.task('clean', function(cb)
{
    var target = prefixPaths(config.cleaning.def);

    del(target, cb);
});

// Copy fontawesome stuff to the fonts directory
// Make sure its isntalled first with bower task
gulp.task('icons', function()
{
    var from = suffixPath(makePath([getDirBower(true), 'fontawesome', 'fonts']));
    var to = getDirBuildFonts(true);

    return gulp.src(from)
            .pipe(gulp.dest(to));
});

// Copy over Javascript
gulp.task('javascript', function()
{
    var from = getDirAppJS(false, 'js');
    var to = getDirBuildScripts(true);

    // Compile to Javascript
    return gulp.src(from)
            .pipe(gulp.dest(to));
});

// Compile Typescript
gulp.task('typescript', function()
{
    var from = getDirAppTS(false, 'ts');
    var to = getDirBuildScripts(true);

    // Compile to Javascript
    return gulp.src(from)
            .pipe(
                ts({
                    // Try to keep it looking like
                    // Javascript
                    removeComments: false,
                    noImplicitAny: true,
                    noLib: false,
                    target: 'ES5',
                    module: 'amd',
                    declarationFiles: false,
                    noExternalResolve: false,
                }))

            // Output it to the scripts directory
            .js.pipe(gulp.dest(to));
});

// Check Javascript for errors, clean the directory beforehand
gulp.task('lint', ['typescript', 'javascript'], function()
{
    var target = getDirBuildScripts();

    // Analyze all Javascript files in its directory
    // and announce reports normally
    return gulp.src(target)
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
});

gulp.task('scripts', ['lint'], function()
{
    // Only have one central target minify all the js
    var from = libJs([getDirBuildScripts(false, 'js')]);
    var to = getDirBuildMinify(true);

    return gulp.src(from)

        .pipe(concat('build.js'))
        .pipe(gulp.dest(to))

        .pipe(rename('build.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(to));
});

// Compile SASS
gulp.task('sass', function()
{
    var from = getDirAppSASS(false, 'scss');
    var to = getDirBuildStyles(true);

    return gulp.src(from)
        .pipe(
                sass({
                    // I think of sourcemaps as a big clutter and unwanted
                    // but unfortunately, until they fix it, this is true regardless of whats here
                    sourcemap: false,

                    // Allow leveraging compass modules
                    // This is broken on Linux, can't be used
                    compass: false,

                    // Allow leveraging ruby gems given
                    // they're listed here first
                    require:
                    [
                    ],

                    // All include paths for SCSS
                    loadPath:
                    [
                        getDirAppSASS(true),
                        makePath([getDirBower(true), 'bootstrap-sass-official', 'assets', 'stylesheets']),
                        makePath([getDirBower(true), 'fontawesome', 'scss'])
                    ]
                })

                // Errors that happen
                .on("error", notify.onError(function (error)
                {
                    return "Error: " + error.message;
                }))
            )

        // Auto prefix for last 2 versions of each browser
        .pipe(autoprefix('last 2 version'))

        // Throw compiled css files to the css directory
        .pipe(gulp.dest(to));
});

// Copy over CSS
gulp.task('css', function()
{
    var from = getDirAppCSS(false, 'css');
    var to = getDirBuildStyles(true);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

// Concat and Minify Styles
gulp.task('styles', ['sass', 'css'], function()
{
    // Combine CSS libraries with user ones
    // Concat the libraries first in the order given above
    // followed by the user libraries in alphabetical order
    var from = libCss([getDirBuildStyles(false, 'css')]);
    var to = getDirBuildMinify(true);

    return gulp.src(from)

        // Concatenate all javascript files into one
        // to place some files before or after, use alphabetical
        // ordering on the necasary files names 
        // output to build diretory
        .pipe(concatCss('build.css'))
        .pipe(gulp.dest(to))

        // Then compress it down tight and
        // output to same directory under .min.js
        .pipe(rename('build.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(to))
});

/*
 * This is where we put everything together
 * phpBB doesnt have a very clear folder structure
 * for styles so we kind of have to rig up
 * a system and aproximate everything
*/

// This is easy to place, obviously the root level
gulp.task('Prep-Raw', function()
{
    var from = getDirAppRaw();
    var to = getDirBuildPrep(true);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

// This is more difficult as I see javascript files scattered everywhere
// so Im going to neatly place them in there own folder in the templates
// folder.
gulp.task('Prep-Scripts', ['scripts'], function()
{
    var from = getDirBuildMinify(false, 'js');
    var to = makePath([getDirBuildPrep(true), 'template/scripts']);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

// phpBB is a bit complicated over this, I see a bundle of CSS
// files in the theme folder along with a mix of other files
// so we'll place it there
gulp.task('Prep-Styles', ['styles'], function()
{
    var from = getDirBuildMinify(false, 'css');
    var to = makePath([getDirBuildPrep(true), 'theme']);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

// This is a bit complicated, there is no media place
// and I see image files scatttered all over the place
// So we're going to place them in the imageset folder
// where I see the most of them
gulp.task('Prep-MediaAll', function()
{
    var from = getDirAppMediaAll();
    var to = makePath([getDirBuildPrep(true), 'imageset']);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

// Images with words that are English in them
gulp.task('Prep-MediaEn', function()
{
    var from = getDirAppMediaEn();
    var to = makePath([getDirBuildPrep(true), 'imageset/en']);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

// Templates are the only clear-cut placement
// so they'll go in the template folder
gulp.task('Prep-Template', function()
{
    var from = getDirAppTemplate(false, 'html');
    var to = makePath([getDirBuildPrep(true), 'template']);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

// This is the most difficult, I think fonts needs to be top-level browser
// but with phpBB what is that, where is that
// Im going to assume Top-Level is Our Style Root
// If not then it can probably be moved by hand
gulp.task('Prep-Fonts', ['icons'], function()
{
    var from = getDirBuildFonts();
    var to = makePath([getDirBuildPrep(true), 'fonts']);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

// And the configuration files
// Which seem to register names to files along with some options
// but whether there predefined or not
// or how these cfg files are found are unclear

gulp.task('Prep-Cfg-ImagesetAll', function()
{
    var from = getDirAppMediaAll(false, 'cfg');
    var to = makePath([getDirBuildPrep(true), 'imageset']);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

gulp.task('Prep-Cfg-ImagesetEn', function()
{
    var from = getDirAppMediaEn(false, 'cfg');
    var to = makePath([getDirBuildPrep(true), 'imageset/en']);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

gulp.task('Prep-Cfg-Template', function()
{
    var from = getDirAppTemplate(false, 'cfg');
    var to = makePath([getDirBuildPrep(true), 'template']);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

gulp.task('Prep-Cfg-Theme', function()
{
    var from = getDirAppCSS(false, 'cfg');
    var to = makePath([getDirBuildPrep(true), 'theme']);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

gulp.task('template', 
[
    'Prep-Raw',
    'Prep-Scripts',
    'Prep-Styles',
    'Prep-MediaAll',
    'Prep-MediaEn',
    'Prep-Template',
    'Prep-Fonts',

    'Prep-Cfg-ImagesetAll',
    'Prep-Cfg-ImagesetEn',
    'Prep-Cfg-Template',
    'Prep-Cfg-Theme'
], function()
{
    var from = getDirBuildPrep();
    var to = getDirBuildTemplate(true);

    return gulp.src(from)
        .pipe(gulp.dest(to));
});

gulp.task('template-zip-archive', ['template'], function()
{
    var from = getDirBuildTemplate();
    var to = getDirBuildArchives(true);

    return gulp.src(from)
        .pipe(zip('BBAir.zip'))
        .pipe(gulp.dest(to));
});

gulp.task('template-tar-archive', ['template'], function()
{
    var from = getDirBuildTemplate();
    var to = getDirBuildArchives(true);

    return gulp.src(from)
        .pipe(tar('BBAir.tar'))
        .pipe(gzip())
        .pipe(gulp.dest(to));
});

gulp.task('default',
[
    'template-zip-archive',
    'template-tar-archive'
]);
