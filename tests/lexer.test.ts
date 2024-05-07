import { lex, Token, TokenType } from '../src/lexer';

describe('testing lexer', () => {
  test('identifiers', () => {
    let res = lex("test test_1");
    expect(res).toEqual([
        new Token(TokenType.IDENTIFIER, "test"),
        new Token(TokenType.IDENTIFIER, "test_1"),
    ]);
  });
  
  test('operators', () => {
    let res = lex("= < <= > >=");
    expect(res).toEqual([
        new Token(TokenType.EQUAL),
        new Token(TokenType.LESS),
        new Token(TokenType.LESS_EQUAL),
        new Token(TokenType.GREATER),
        new Token(TokenType.GREATER_EQUAL),
    ]);
  });
  
  test('numbers', () => {
    let res = lex("1234 1.01 -10 -0.25");
    expect(res).toEqual([
        new Token(TokenType.NUMBER, 1234),
        new Token(TokenType.NUMBER, 1.01),
        new Token(TokenType.NUMBER, -10),
        new Token(TokenType.NUMBER, -0.25),
    ]);
  });
  
  test('dates', () => {
    let res = lex("1.1.1 865.14.01 -260.1.1");
    expect(res).toEqual([
        new Token(TokenType.DATE, "1.1.1"),
        new Token(TokenType.DATE, "865.14.01"),
        new Token(TokenType.DATE, "-260.1.1"),
    ]);
  });
  
  test('strings', () => {
    let res = lex("\"Lexical tokenization is conversion of a text into (semantically or syntactically) meaningful lexical tokens.\"");
    expect(res).toEqual([
        new Token(TokenType.STRING, "Lexical tokenization is conversion of a text into (semantically or syntactically) meaningful lexical tokens."),
    ]);
  });
  
  test('braces', () => {
    let res = lex("{}");
    expect(res).toEqual([
        new Token(TokenType.LEFT_BRACE),
        new Token(TokenType.RIGHT_BRACE),
    ]);
  });
  
  test('comments', () => {
    let res = lex("test# this is a comment.\ntest2");
    expect(res).toEqual([
        new Token(TokenType.IDENTIFIER, "test"),
        new Token(TokenType.COMMENT, " this is a comment."),
        new Token(TokenType.IDENTIFIER, "test2"),
    ]);
  });
  
  test('all', () => {
    let res = lex("test = { name = \"robert\" id = 1023 test<=1.01\"tag\" = {} }   ");
    expect(res).toEqual([
        new Token(TokenType.IDENTIFIER, "test"),
        new Token(TokenType.EQUAL),
        new Token(TokenType.LEFT_BRACE),
        new Token(TokenType.IDENTIFIER, "name"),
        new Token(TokenType.EQUAL),
        new Token(TokenType.STRING, "robert"),
        new Token(TokenType.IDENTIFIER, "id"),
        new Token(TokenType.EQUAL),
        new Token(TokenType.NUMBER, 1023),
        new Token(TokenType.IDENTIFIER, "test"),
        new Token(TokenType.LESS_EQUAL),
        new Token(TokenType.NUMBER, 1.01),
        new Token(TokenType.STRING, "tag"),
        new Token(TokenType.EQUAL),
        new Token(TokenType.LEFT_BRACE),
        new Token(TokenType.RIGHT_BRACE),
        new Token(TokenType.RIGHT_BRACE),
    ]);
  });
});
