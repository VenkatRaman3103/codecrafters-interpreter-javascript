import fs from "fs";

const args = process.argv.slice(2);

if (args.length < 2) {
    console.error("Usage: ./your_program.sh tokenize <filename>");
    process.exit(1);
}

let foundError = false;

// command
const command = args[0];

if (command !== "tokenize" && command !== "parse") {
    console.error(`Usage: Unknown command: ${command}`);
    process.exit(1);
}

const keyword = {
    and: "AND",
    class: "CLASS",
    else: "ELSE",
    if: "IF",
    for: "FOR",
    false: "FALSE",
    fun: "FUN",
    nil: "NIL",
    or: "OR",
    print: "PRINT",
    return: "RETURN",
    super: "SUPER",
    this: "THIS",
    true: "TRUE",
    var: "VAR",
    while: "WHILE",
};

class Token {
    constructor(type, lexeme, literal, line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }
}

// tokenizer helper functions
function isChar(ch) {
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
}

function isNumber(ch) {
    return ch >= "0" && ch <= "9";
}

// tokenizer
function tokenizer(fileContent) {
    const tokens = [];
    let lineNumber = 1;

    for (let cursor = 0; cursor < fileContent.length; cursor++) {
        let char = fileContent[cursor];

        if (char === "(") {
            tokens.push(new Token("LEFT_PAREN", "(", null, lineNumber));
            if (command === "tokenize") console.log("LEFT_PAREN ( null");
        } else if (char === ")") {
            tokens.push(new Token("RIGHT_PAREN", ")", null, lineNumber));
            if (command === "tokenize") console.log("RIGHT_PAREN ) null");
        } else if (char === "{") {
            tokens.push(new Token("LEFT_BRACE", "{", null, lineNumber));
            if (command === "tokenize") console.log("LEFT_BRACE { null");
        } else if (char === "}") {
            tokens.push(new Token("RIGHT_BRACE", "}", null, lineNumber));
            if (command === "tokenize") console.log("RIGHT_BRACE } null");
        } else if (char === "*") {
            tokens.push(new Token("STAR", "*", null, lineNumber));
            if (command === "tokenize") console.log("STAR * null");
        } else if (char === ".") {
            tokens.push(new Token("DOT", ".", null, lineNumber));
            if (command === "tokenize") console.log("DOT . null");
        } else if (char === ",") {
            tokens.push(new Token("COMMA", ",", null, lineNumber));
            if (command === "tokenize") console.log("COMMA , null");
        } else if (char === "+") {
            tokens.push(new Token("PLUS", "+", null, lineNumber));
            if (command === "tokenize") console.log("PLUS + null");
        } else if (char === "-") {
            tokens.push(new Token("MINUS", "-", null, lineNumber));
            if (command === "tokenize") console.log("MINUS - null");
        } else if (char === ";") {
            tokens.push(new Token("SEMICOLON", ";", null, lineNumber));
            if (command === "tokenize") console.log("SEMICOLON ; null");
        } else if (char == "=") {
            if (fileContent[cursor + 1] == "=") {
                tokens.push(new Token("EQUAL_EQUAL", "==", null, lineNumber));
                if (command === "tokenize") console.log("EQUAL_EQUAL == null");
                cursor++;
            } else {
                tokens.push(new Token("EQUAL", "=", null, lineNumber));
                if (command === "tokenize") console.log("EQUAL = null");
            }
        } else if (char == "!") {
            if (fileContent[cursor + 1] == "=") {
                tokens.push(new Token("BANG_EQUAL", "!=", null, lineNumber));
                if (command === "tokenize") console.log("BANG_EQUAL != null");
                cursor++;
            } else {
                tokens.push(new Token("BANG", "!", null, lineNumber));
                if (command === "tokenize") console.log("BANG ! null");
            }
        } else if (char == "<") {
            if (fileContent[cursor + 1] == "=") {
                tokens.push(new Token("LESS_EQUAL", "<=", null, lineNumber));
                if (command === "tokenize") console.log("LESS_EQUAL <= null");
                cursor++;
            } else {
                tokens.push(new Token("LESS", "<", null, lineNumber));
                if (command === "tokenize") console.log("LESS < null");
            }
        } else if (char == ">") {
            if (fileContent[cursor + 1] == "=") {
                tokens.push(new Token("GREATER_EQUAL", ">=", null, lineNumber));
                if (command === "tokenize")
                    console.log("GREATER_EQUAL >= null");
                cursor++;
            } else {
                tokens.push(new Token("GREATER", ">", null, lineNumber));
                if (command === "tokenize") console.log("GREATER > null");
            }
        } else if (char == "/") {
            if (fileContent[cursor + 1] == "/") {
                cursor++;
                while (
                    cursor < fileContent.length &&
                    fileContent[cursor] !== "\n"
                ) {
                    cursor++;
                }
                cursor--;
            } else {
                tokens.push(new Token("SLASH", "/", null, lineNumber));
                if (command === "tokenize") console.log("SLASH / null");
            }
        } else if (char === '"') {
            let string = "";
            cursor++;

            while (cursor < fileContent.length && fileContent[cursor] !== '"') {
                string += fileContent[cursor];
                cursor++;
            }

            if (cursor < fileContent.length && fileContent[cursor] === '"') {
                tokens.push(
                    new Token("STRING", `"${string}"`, string, lineNumber),
                );
                if (command === "tokenize")
                    console.log(`STRING "${string}" ${string}`);
            } else {
                console.error(
                    `[line ${lineNumber}] Error: Unterminated string.`,
                );
                foundError = true;
            }
        } else if (/\d/.test(char)) {
            let number = "";
            let hasDecimal = false;

            while (cursor < fileContent.length) {
                const currentChar = fileContent[cursor];

                if (/\d/.test(currentChar)) {
                    number += currentChar;
                    cursor++;
                } else if (currentChar === "." && !hasDecimal) {
                    hasDecimal = true;
                    number += currentChar;
                    cursor++;
                } else {
                    break;
                }
            }

            cursor--;

            let literalValue;
            if (hasDecimal) {
                const parsed = parseFloat(number);
                literalValue = parsed % 1 === 0 ? parsed.toFixed(1) : parsed;
            } else {
                literalValue = parseFloat(number).toFixed(1);
            }

            tokens.push(
                new Token(
                    "NUMBER",
                    number,
                    parseFloat(literalValue),
                    lineNumber,
                ),
            );
            if (command === "tokenize")
                console.log(`NUMBER ${number} ${literalValue}`);
        } else if (isChar(char) || char == "_") {
            let str = "";

            while (
                cursor < fileContent.length &&
                (isChar(fileContent[cursor]) ||
                    fileContent[cursor] == "_" ||
                    isNumber(fileContent[cursor]))
            ) {
                str += fileContent[cursor];
                cursor++;
            }
            cursor--;

            if (keyword[str]) {
                tokens.push(new Token(keyword[str], str, null, lineNumber));
                if (command === "tokenize")
                    console.log(`${keyword[str]} ${str} null`);
            } else {
                tokens.push(new Token("IDENTIFIER", str, null, lineNumber));
                if (command === "tokenize")
                    console.log(`IDENTIFIER ${str} null`);
            }
        } else if (char === "\n") {
            lineNumber++;
        } else if (char === " " || char === "\t" || char === "\r") {
            continue;
        } else {
            console.error(
                `[line ${lineNumber}] Error: Unexpected character: ${char}`,
            );
            foundError = true;
        }
    }

    tokens.push(new Token("EOF", "", null, lineNumber));
    if (command === "tokenize") console.log("EOF  null");

    return tokens;
}

function parseExpression(tokens) {
    let index = 0;

    function parseGrouping() {
        if (tokens[index].type === "LEFT_PAREN") {
            index++;
            const expr = parseExpression();
            if (tokens[index].type === "RIGHT_PAREN") {
                index++;
                return `(group ${expr})`;
            } else {
                return null;
            }
        }
        return parsePrimary();
    }

    function parsePrimary() {
        const token = tokens[index];

        if (token.type === "TRUE") {
            index++;
            return "true";
        } else if (token.type === "FALSE") {
            index++;
            return "false";
        } else if (token.type === "NIL") {
            index++;
            return "nil";
        } else if (token.type === "NUMBER") {
            index++;
            const num = token.literal;
            if (num % 1 === 0) {
                return num.toFixed(1);
            } else {
                return num.toString();
            }
        } else if (token.type === "STRING") {
            index++;
            return token.literal;
        }

        return null;
    }

    function parseExpression() {
        return parseGrouping();
    }

    return parseExpression();
}

// file path
const filename = args[1];

const fileContent = fs.readFileSync(filename, "utf8");

if (command === "tokenize") {
    if (fileContent.length !== 0) {
        tokenizer(fileContent);
    } else {
        console.log("EOF  null");
    }

    if (foundError) {
        process.exit(65);
    }
} else if (command === "parse") {
    const tokens = tokenizer(fileContent);
    if (foundError) {
        process.exit(65);
    }

    const result = parseExpression(tokens);
    if (result) {
        console.log(result);
    }
}
