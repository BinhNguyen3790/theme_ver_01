var connect = require("gulp-connect");
var gulp = require("gulp");
var browser = require("browser-sync");
var autoprefixer = require("gulp-autoprefixer");
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var runSequence = require("run-sequence");
var imagemin = require("gulp-imagemin");
var htmlhint = require("gulp-htmlhint");
var del = require("del");
var open = require("gulp-open");
var fileinclude = require("gulp-file-include");
var cleanCSS = require("gulp-clean-css");
var prettify = require("gulp-jsbeautifier");
var watch = require("gulp-watch");
var uglify = require("gulp-uglify");
var root = "./public/";

gulp.sources = {
  src: "./public",
  dist: "./html",
};

gulp.task("html", function () {
  gulp.src(root + "/**/*.html").pipe(browser.reload({ stream: true }));
});

gulp.task("js", ["htmlhint"], function () {
  gulp.src(root + "/assets/js/**/**.js").pipe(browser.reload({ stream: true }));
});

// Watch
gulp.task("stream", () => {
  gulp.watch(gulp.sources.src + "/assets/**/*.scss", ["sass"]);
  gulp.watch(gulp.sources.src + "/views/**/*.html", ["fileinclude"]);
  gulp.watch(gulp.sources.src + "/assets/**/*.js", ["js"]);
  watch("**/*.css").pipe(connect.reload());
  watch("**/*.js").pipe(connect.reload());
});

// Remove dist
gulp.task("clean", () => {
  return del([gulp.sources.dist]);
});

// Remove folder
gulp.task("cleanFolder", () => {
  return del([gulp.sources.dist + "/views", gulp.sources.dist + "/layouts", gulp.sources.dist + "/inc"]);
});

// Start server dev
gulp.task("connect:dev", () => {
  var server = connect.server({
    root: [gulp.sources.src, ".tmp", "./"],
    livereload: true,
    port: 9000,
    host: "localhost",
    fallback: gulp.sources.src + "/index.html",
  });

  return gulp.src("./").pipe(
    open({
      uri: "http://" + server.host + ":" + server.port,
    })
  );
});

// Start server product
gulp.task("connect:prod", () => {
  connect.server({
    root: [gulp.sources.dist],
    livereload: true,
    port: 9900,
    host: "localhost",
    fallback: gulp.sources.dist + "/index.html",
  });
  return gulp.src("./").pipe(
    open({
      uri: "http://" + server.host + ":" + server.port,
    })
  );
});

// Start development server
gulp.task("run:dev", () => {
  runSequence("connect:dev", "fileinclude", "sass", "stream", () => {
    console.log("Development version is running...");
  });
});

// Start product server
gulp.task("run:prod", () => {
  runSequence("build", "connect:prod", () => {
    console.log("Production version is running...");
  });
});

// Copy fonts
gulp.task("htmlhint", ["fileinclude"], () => {
  return gulp
    .src(gulp.sources.src + "/*.html")
    .pipe(htmlhint())
    .pipe(htmlhint.failReporter());
});

// Include HTML
gulp.task("fileinclude", () => {
  return gulp
    .src([gulp.sources.src + "/views/**"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest(gulp.sources.src))
    .pipe(connect.reload());
});

// Sass
gulp.task("sass", ["htmlhint"], () => {
  return (
    gulp
      .src(gulp.sources.src + "/assets/scss/**/*.scss")
      .pipe(
        sass({
          outputStyle: "expanded",
          indentWidth: "4",
        }).on("error", sass.logError)
      )
      .pipe(plumber())
      .pipe(
        autoprefixer({
          browsers: ["last 2 versions", "Android >= 4.1.0", "iOS >= 7"],
          cascade: false,
          grid: true,
        })
      )
      .pipe(sass.sync().on("error", sass.logError))
      //build dev
      .pipe(gulp.dest(root + "/assets/css/"))
      //build dist
      .pipe(gulp.dest(gulp.sources.dist + "/assets/css/"))
      .pipe(connect.reload())
  );
});

// Minify images
gulp.task("imagemin", () => {
  return gulp
    .src(gulp.sources.src + "/assets/img/**/*")
    .pipe(
      imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true,
        verbose: true,
      })
    )
    .pipe(gulp.dest(gulp.sources.dist + "/assets/img"));
});

// HTML beautify
gulp.task("prettify", ["copy:fonts"], () => {
  return gulp
    .src([gulp.sources.src + "/**/*.html"])
    .pipe(
      prettify({
        indent_char: " ",
        indent_size: 2,
      })
    )
    .pipe(gulp.dest(gulp.sources.dist));
});

// Copy fonts
gulp.task("copy:fonts", () => {
  return gulp.src(gulp.sources.src + "/assets/fonts/**/*").pipe(gulp.dest(gulp.sources.dist + "/assets/fonts"));
});

// Copy files
gulp.task("copy:files", () => {
  return gulp.src(gulp.sources.src + "/assets/files/**/*").pipe(gulp.dest(gulp.sources.dist + "/assets/files"));
});

// Minify CSS, JS
gulp.task("minifyCss", () => {
  return gulp
    .src("./html/**/*.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(gulp.sources.dist));
});

gulp.task("copyCss", () => {
  return gulp.src(gulp.sources.src + "/assets/css/**/*").pipe(gulp.dest(gulp.sources.dist + "/assets/css"));
});

gulp.task("copy:js", () => {
  return gulp.src(gulp.sources.src + "/assets/js/**/*").pipe(gulp.dest(gulp.sources.dist + "/assets/js"));
});

gulp.task("pack-js", function () {
  return gulp.src(["public/assets/js/*"]).pipe(uglify()).pipe(gulp.dest("html/assets/js"));
});

// Build source
gulp.task("build", () => {
  runSequence("clean", "fileinclude", "htmlhint", "sass", "imagemin", "copy:fonts", "copyCss", "copy:js", "minifyCss", "pack-js", "copy:files", "prettify", "cleanFolder", (e) => {
    if (!e) {
      console.log("Success!");
    }
  });
});
