import gulp from 'gulp';

import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulpClean from 'gulp-clean';
import source from 'vinyl-source-stream';
import ts from 'gulp-typescript';
import uglify from 'gulp-uglify';

function resolveOutput(filename) {
  const name = filename.split('/').pop();
  const pathArray = filename.split('/');
  pathArray.pop();
  const path = pathArray.join('/');
  return {
    name: name, path: path.length ? `${path}/` : '',
  };
}

const paths = {
  scripts: {
    src: 'src-front/scripts/**/*.ts',
    dest: `${process.env.DIRNAME}/scripts`,
    entries: ['index.js', 'user/index.js', 'user/friends.js', 'feed/index.js'],
    tmp: `${process.env.DIRNAME}/tmp`,
  },
};

function typescripts() {
  const tsProject = ts.createProject('tsconfig.json');
  return gulp.src(paths.scripts.src).
      pipe(tsProject()).
      pipe(gulp.dest(paths.scripts.tmp));
}

function scripts() {
  return paths.scripts.entries.map((script) => {
    const {name, path} = resolveOutput(script);
    const src = `${paths.scripts.tmp}/${script}`;
    const dest = `${paths.scripts.dest}/${path}`;
    const taskName = `scripts-${script}`;
    gulp.task(taskName, () => {
      return browserify(src).
          transform(babelify).
          bundle().
          pipe(source(name)).
          pipe(buffer()).
          pipe(uglify()).
          pipe(gulp.dest(dest));
    });
    return taskName;
  });
}

function clean() {
  return gulp.src(paths.scripts.tmp, {read: false, allowEmpty: true}).
      pipe(gulpClean());
}

const build = gulp.series(typescripts, gulp.parallel(scripts()), clean);

gulp.task('default', build);