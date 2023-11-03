import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
  input: "src/functions/httpTrigger.ts",
  output: {
    format: "cjs",
    dir: `.rollup`,
  },
  plugins: [
    typescript({
      compilerOptions: {
        outDir: `.rollup`,
        module: null,
        sourceMap: false,
      },
      exclude: [
        "node_modules",
        // Exclude test files
        /\.test.((js|jsx|ts|tsx))$/,
      ],
    }),
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    json(),
  ],
  external: ["@azure/functions-core"],
};
