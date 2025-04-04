import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/star-compass.js',
  output: {
    file: 'dist/star-compass.js',
    format: 'es',
    name: 'StarCompass',
    exports: 'default'  
  },
  plugins: [terser()],
}
