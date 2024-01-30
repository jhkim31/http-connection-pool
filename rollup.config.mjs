import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import { dts } from "rollup-plugin-dts";

export default [
  {
    input: 'src/index.ts',
    output: {
      file: "dist/index.js",
      format: 'cjs',
    },
    plugins: [resolve(), typescript({ tsconfig: "./tsconfig.json", declaration: false })]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.mjs',
      format: 'esm'
    },
    plugins: [resolve(), typescript({ tsconfig: "./tsconfig.json", declaration: false })]
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/types',      
      format: 'esm'
    },
    plugins: [resolve(), typescript({ tsconfig: "./tsconfig.json", outDir : "./dist/types", emitDeclarationOnly : true })]
  },
  {
    input: "./dist/types/index.d.ts",
    output: [
      {
        file: "dist/index.d.ts",
        format: "esm"
      },
      {
        file: "dist/index.d.mts",
        format: "esm"
      }
    ],
    plugins: [resolve(), dts()],
  }
]
