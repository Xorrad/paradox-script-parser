import * as FS from 'fs';
import * as Console from 'console';

import * as Parser from './parser'
import * as Lexer from './lexer'
import * as CK3Character from './ck3/character'

Console.profile("index");

console.log("Begin execution...");
const filePath = "examples/ck3_character2.txt";

console.log("filePath=" + filePath);

// Test lexer
let contents = FS.readFileSync(filePath, 'utf-8');
Console.time("lex");
let tokens = Lexer.lex(contents);
Console.timeEnd("lex");

// console.log("Loaded " + Object.keys(tokens).length + " tokens");
// console.log(tokens);

// Test parser
// const nodes = Parser.parseFile(filePath);
// console.log("Loaded " + Object.keys(nodes).length + " nodes");

// Test loading charactetrs from a file.
// const characters = CK3Character.loadCharacters(filePath);
// console.log(characters);

Console.profileEnd("index");