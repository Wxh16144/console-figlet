import c from "kleur";
import { hr } from './util';
import figlet from 'figlet'

export default () => {
  const allFonts = figlet.fontsSync();
  for (const [index, font] of allFonts.entries()) {
    globalThis.console.log(
      c.bold(index + 1).concat(
        c.bold(':'),
        c.green().underline(font)
      )
    );
  }
  globalThis.console.log(hr('-', 18))
  globalThis.console.log(c.bold(`Total: Support ${c.green(allFonts.length)}`))
}