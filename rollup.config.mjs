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
    plugins: [resolve(), typescript({ tsconfig: "./bundleHelper/tsconfig.cjs.json" })]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.mjs',
      format: 'esm'
    },
    plugins: [resolve(), typescript({ tsconfig: "./bundleHelper/tsconfig.esm.json" })]
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/types',
      format: 'esm'
    },
    plugins: [resolve(), typescript({ tsconfig: "./bundleHelper/tsconfig.types.json" })]
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
