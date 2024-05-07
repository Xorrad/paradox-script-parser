import * as Console from 'console';

import { Reader } from './reader'

export enum TokenType {
    // Separators / Punctuators
    LEFT_BRACE, RIGHT_BRACE, TWO_DOTS,

    // Operators
    EQUAL,
    LESS, LESS_EQUAL,
    GREATER, GREATER_EQUAL, 

    // Literals
    STRING, NUMBER, BOOLEAN, DATE,
    
    // Others
    COMMENT, IDENTIFIER,
};

export class Token {
    private type: TokenType;
    private value: any;

    constructor(type: TokenType, value: any = undefined) {
        this.type = type;
        this.value = value;
    }

    public getType(): TokenType {
        return this.type;
    }

    public is(type: TokenType): boolean {
        return this.type == type;
    }

    public getValue(): any {
        return this.value;
    }
};

export function lex(str: string): Token[] {
    let tokens: any[] = [];
    const reader = new Reader(str);

    while(!reader.isEmpty()) {
        // Save the cursor position.
        reader.start();
        let token = readToken(reader);
        if(token != undefined)
            tokens.push(token);
    }

    return tokens;
}

function readToken(reader: Reader): Token | undefined {
    let ch = reader.advance();
    let line = reader.getLine();
    switch(ch) {
        // Ignore whitespaces.
        case ' ':
        case '\r':
        case '\t':
        case '\n':
        case String.fromCharCode(65279): // ZERO WIDTH NO-BREAK SPACE
            break;
        case '{': return new Token(TokenType.LEFT_BRACE);
        case '}': return new Token(TokenType.RIGHT_BRACE);
        case ':': return new Token(TokenType.TWO_DOTS);
        case '=': return new Token(TokenType.EQUAL);
        case '<': return new Token(reader.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        case '>': return new Token(reader.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        case '#':
            // Ignore '#' in value of token.
            reader.start();
            reader.skipTo('\n');
            return new Token(TokenType.COMMENT, reader.end());
        case '"': return readString(reader);
        default:
            if(isDigit(ch) || ch == '-') {
                let token = readNumber(reader);
                if(token != undefined)
                    return token;
            }
            if(isAlphaNumeric(ch) || ch == '-') {
                let token = readIdentifier(reader);
                if(token != undefined)
                    return token;
            }
            throw new SyntaxError("Unexpected character \'" + ch + "\' (" + ch.charCodeAt(0) + ") at line " + line + ".");
    }
    return undefined;
}

function readString(reader: Reader): Token {
    // Save cursor to discard starting quote.
    let line = reader.getLine();

    reader.start();
    reader.skipTo('"');

    if(reader.isEmpty())
        throw new SyntaxError("Expected end-of-string quote missing at line " + line + ".");

    // Discard ending quote in token value.
    let str = reader.end();
    reader.advance();

    return new Token(TokenType.STRING, str);
}

function readNumber(reader: Reader): Token | undefined {
    // Check if it is a NUMBER:
    // - only digits
    // - allow one decimal '.'

    while(isDigit(reader.peek()))
        reader.advance();
    if(reader.peek() == '.') {
        reader.advance();

        // Don't allow trailing floating points.
        if(!isDigit(reader.peek()))
            return undefined;

        while(isDigit(reader.peek()))
            reader.advance();

        // Skip if number ends by a dot because it may be a date.
        if(reader.peek() == '.')
            return undefined;
    }
    let str = reader.end();
    return new Token(TokenType.NUMBER, Number(str));
}

function readIdentifier(reader: Reader): Token | undefined {
    // An IDENTIFIER can have only have digits, letters, '.' and '_',
    // whereas a BOOLEAN is either 'yes' or 'no',
    // and a DATE is formatted as: yyyy.mm.dd

    while(isAlphaNumeric(reader.peek()) || reader.peek() == '.')
        reader.advance();
    let str = reader.end();

    // Check if the string is a valid boolean.
    if(str == 'yes' || str == 'no')
        return new Token(TokenType.BOOLEAN, str == 'yes');

    
    // Check if the string is a valid date.
    let dots = 0;
    let firstIndex = str[0] == '-' ? 1 : 0
    for(let i = firstIndex; i < str.length; i++) {
        // A date cannot have the following:
        // ".0000" or "0000."
        // "*x*" with x a non-digit character
        let digit = isDigit(str[i]);
        if(((i == firstIndex || i == str.length-1) && !digit)
            || (!digit && str[i] != '.')
            || (!digit && str[i] == '.' && str[i-1] == '.')) {
            dots = 0;
            break;
        }
        if(str[i] == '.')
            dots++;
    }
    if(dots != 2)
        return new Token(TokenType.IDENTIFIER, str);

    return new Token(TokenType.DATE, str);
}

function isDigit(ch: string): boolean {
    let c = ch.charCodeAt(0);
    return c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0);
}

function isAlpha(ch: string): boolean {
    let c = ch.charCodeAt(0);
    return (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0))
        || (c >= 'A'.charCodeAt(0) && c <= 'Z'.charCodeAt(0))
        || (c == '_'.charCodeAt(0));
}

function isAlphaNumeric(ch: string): boolean {
    return isDigit(ch) || isAlpha(ch);
}