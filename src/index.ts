import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";
import c from "kleur";
import mri, { Options } from "mri";
import figlet, { Options as FigletOptions } from 'figlet'
import merge from "lodash.merge";
import pick from "lodash.pick";
import font from './font';
import { br, hr } from "./util";

interface Argv extends FigletOptions {
  help?: boolean;
  version?: boolean;
  fonts?: boolean;
  all?: boolean;
  _: string[];
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolvePath = (...arg: any[]) => path.resolve(__dirname, '..', ...arg);
const readFileSync = (path: string) => fs.readFileSync(resolvePath(path), 'utf8');
const pkg = JSON.parse(readFileSync('./package.json'));
const command = Object.keys(pkg.bin ?? {})[0] ?? pkg.name;
// const moduleName = pkg.name.replace(/^@.*\//, '')

/** {@link FigletOptions} */
const defaultOptions: Options = {
  alias: {
    f: 'font',
    w: 'width',
  },
  string: ['font', 'horizontalLayout', 'verticalLayout'],
  boolean: ['whitespaceBreak'],
  default: { font: 'Standard' }
}

const argv = mri<Argv>(process.argv.slice(2), merge<Options, Options>({
  alias: {
    h: 'help',
    v: 'version',
  },
  boolean: ['help', 'version', 'fonts', 'all'],
}, defaultOptions));

async function main(args: Argv = argv) {
  if (args.version) {
    console.log(`${c.bold(pkg.name)}: ${c.green('v' + pkg.version)}`);
    return;
  }

  if (args.help) {
    console.log(`
    npx ${c.bold(command)} [options]
    ----------------------------------------
    -${c.bold('h')}, --help: show help.
    -${c.bold('v')}, --version: show version. ${c.green('v' + pkg.version)}
    -${c.bold('f')}, --font: A string value that indicates the FIGlet font to use. ${c.bold('@default:').concat(c.cyan('Standard'))}
    -${c.bold('w')}, --width: This option allows you to limit the width of the output.
    ${c.bold('--fonts:')} Show all fonts.
    ${c.bold('--horizontalLayout:')} A string value that indicates the horizontal layout to use.
    ${c.bold('--verticalLayout:')} A string value that indicates the vertical layout to use.
    ${c.bold('--whitespaceBreak:')} This option works in conjunction with "width". 
    ----------------------------------------
    ${c.bold('e.g.')} ${c.green(`${command} Hello World`)} 
  `)
    return;
  }

  if (args.fonts) {
    return font();
  }

  // ===== Core =====
  const text = args._.length ? args._.join(' ') : `${pkg.name}@${pkg.version}`;
  if (!text) return;

  const validOptions = pick(args, [
    'width',
    'horizontalLayout',
    'verticalLayout',
    'whitespaceBreak',
  ]);
  const allFonts = figlet.fontsSync();
  const fonts = new Set(
    args.all
      ? allFonts
      : (
        Array.isArray(args.font)
          ? args.font
          : [args.font]
      ).filter(font => allFonts.includes(font))
  );

  for (const font of fonts) {
    const options: FigletOptions = { ...validOptions, font }
    const result = figlet.textSync(text, options);
    globalThis.console.log(result);

    if (fonts.size > 1) {
      if (!Array.isArray(args.font)) {
        br()
        globalThis.console.log(c.bold('Try command: ').concat(c.green(`npx ${command}@${pkg.version} "${text}" -f ${font}`)))
      }
      globalThis.console.log(hr('-', Infinity));
    }
  }
}

export default main;
