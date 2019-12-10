import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';


export default {
    plugins: [
        resolve(),
        babel({
            presets: [
                [
                    '@babel/env',
                    {
                        modules: 'false',
                        targets: {
                            browsers: '> 1%, IE 11, not op_mini all, not dead',
                            node: 8
                        },
                        useBuiltIns: 'usage'
                    }
                ]
            ]
        }),
        commonjs(),
        terser()
    ],
    output: {
        format: 'iife', // use browser globals
    },
    treeshake: {
        moduleSideEffects: false
    }
};
