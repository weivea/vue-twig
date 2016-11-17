import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-js';
export default {
  entry: './index.js',
  format: 'cjs',
  plugins: [ babel(), uglify({}, minify) ],
  dest: 'dist/twig.js' // equivalent to --output
};