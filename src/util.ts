
import termSize from 'term-size';

export const hr = (str = "-", num = 20) => str.repeat(Math.min(termSize().columns, num));
export const br = (num = 1) => { for (let i = 0; i < num; i++) globalThis.console.log() }