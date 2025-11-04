import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import license from "rollup-plugin-license";
import terser from "@rollup/plugin-terser";
import path from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

process.env.NODE_ENV = "production";

const createConfig = ({ umd = false, output } = {}) => ({
  input: "src/index.js",
  output,
  external: [
    ...Object.keys(umd ? {} : pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  /**
   * suppress false warnings https://github.com/rollup/rollup-plugin-babel/issues/84
   */
  onwarn: () => null,
  plugins: [
    babel({ 
      babelHelpers: 'runtime',
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs({ extensions: [".js", ".jsx"] }),
    umd && terser(),
    license({
      banner: readFileSync(path.join(__dirname, "LICENSE"), "utf-8")
    })
  ].filter(Boolean)
});

export default [
  createConfig({
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ]
  }),
  createConfig({
    umd: true,
    output: {
      file: pkg.unpkg,
      format: "umd",
      name: "ReactTextareaAutocomplete"
    }
  })
];
