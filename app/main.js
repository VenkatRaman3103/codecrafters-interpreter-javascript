import fs from "fs";

const args = process.argv.slice(2);

if (args.length < 2) {
    console.error("Usage: ./your_program.sh tokenize <filename>");
    process.exit(1);
}

let foundError = false;

// command
const command = args[0];

if (command !== "tokenize" && command !== "parse" && command !== "evaluate") {
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

function isTruthy(value) {
    if (value === "nil" || value === null) return false;
    if (typeof value === "boolean") return value;
    return true;
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
    let foundError = false;

    function error(token, message) {
        console.error(
            `[line ${token.line}] Error at '${token.lexeme}': ${message}`,
        );
        foundError = true;
        return null;
    }

    function parseEquality() {
        let left = parseComparison();
        if (left === null) return null;

        while (
            index < tokens.length &&
            (tokens[index].type === "EQUAL_EQUAL" ||
                tokens[index].type === "BANG_EQUAL")
        ) {
            const operator = tokens[index].lexeme;
            index++;
            const right = parseComparison();
            if (right === null) return null;
            left = `(${operator} ${left} ${right})`;
        }

        return left;
    }

    function parseComparison() {
        let left = parseAddition();
        if (left === null) return null;

        while (
            index < tokens.length &&
            (tokens[index].type === "GREATER" ||
                tokens[index].type === "GREATER_EQUAL" ||
                tokens[index].type === "LESS" ||
                tokens[index].type === "LESS_EQUAL")
        ) {
            const operator = tokens[index].lexeme;
            index++;
            const right = parseAddition();
            if (right === null) return null;
            left = `(${operator} ${left} ${right})`;
        }

        return left;
    }

    function parseAddition() {
        let left = parseMultiplication();
        if (left === null) return null;

        while (
            index < tokens.length &&
            (tokens[index].type === "PLUS" || tokens[index].type === "MINUS")
        ) {
            const operator = tokens[index].lexeme;
            index++;
            const right = parseMultiplication();
            if (right === null) return null;
            left = `(${operator} ${left} ${right})`;
        }

        return left;
    }

    function parseMultiplication() {
        let left = parseUnary();
        if (left === null) return null;

        while (
            index < tokens.length &&
            (tokens[index].type === "STAR" || tokens[index].type === "SLASH")
        ) {
            const operator = tokens[index].lexeme;
            index++;
            const right = parseUnary();
            if (right === null) return null;
            left = `(${operator} ${left} ${right})`;
        }

        return left;
    }

    function parseUnary() {
        if (tokens[index].type === "BANG") {
            index++;
            const expr = parseUnary();
            if (expr === null) return null;
            return `(! ${expr})`;
        } else if (tokens[index].type === "MINUS") {
            index++;
            const expr = parseUnary();
            if (expr === null) return null;
            return `(- ${expr})`;
        }

        return parsePrimary();
    }

    function parsePrimary() {
        if (index >= tokens.length || tokens[index].type === "EOF") {
            const token = tokens[index - 1] || { lexeme: "", line: 1 };
            return error(token, "Expect expression.");
        }

        if (tokens[index].type === "LEFT_PAREN") {
            const parenToken = tokens[index];
            index++;
            const expr = parseEquality();
            if (expr === null) return null;

            if (
                index >= tokens.length ||
                tokens[index].type !== "RIGHT_PAREN"
            ) {
                const currentToken = tokens[index] || {
                    lexeme: "",
                    line: parenToken.line,
                };
                return error(currentToken, "Expect ')' after expression.");
            }
            index++;
            return `(group ${expr})`;
        }

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
        } else if (token.type === "IDENTIFIER") {
            index++;
            return token.lexeme;
        }

        return error(token, "Expect expression.");
    }

    const result = parseEquality();
    if (foundError) {
        return { error: true };
    }
    return result;
}

// evaluation
function evaluateExpr(expr) {
    if (typeof expr === "number") return expr;
    if (typeof expr === "boolean") return expr;
    if (expr === null) return null;

    if (typeof expr === "string") {
        if (expr.startsWith("(") && expr.endsWith(")")) {
            const content = expr.slice(1, -1).trim();

            if (content.startsWith("group ")) {
                return evaluateExpr(content.substring(6));
            }

            if (content.startsWith("! ")) {
                const operand = evaluateExpr(content.substring(2));
                return !isTruthy(operand);
            }

            if (content.startsWith("- ")) {
                const operand = evaluateExpr(content.substring(2));
                return -operand;
            }

            const binaryMatch = content.match(/^(==|!=|<=|>=|<|>|\+|-|\*|\/) /);
            if (binaryMatch) {
                const operator = binaryMatch[1];
                const restContent = content.substring(operator.length + 1);
                const { left, right } = splitBinaryOperands(restContent);

                if (left !== null && right !== null) {
                    const leftVal = evaluateExpr(left);
                    const rightVal = evaluateExpr(right);

                    switch (operator) {
                        case "+":
                            return leftVal + rightVal;
                        case "-":
                            return leftVal - rightVal;
                        case "*":
                            return leftVal * rightVal;
                        case "/":
                            return leftVal / rightVal;
                        case "==":
                            return leftVal === rightVal;
                        case "!=":
                            return leftVal !== rightVal;
                        case "<":
                            return leftVal < rightVal;
                        case "<=":
                            return leftVal <= rightVal;
                        case ">":
                            return leftVal > rightVal;
                        case ">=":
                            return leftVal >= rightVal;
                        default:
                            throw new Error("Unknown operator: " + operator);
                    }
                }
            }

            return evaluateExpr(content);
        }

        // primitive
        if (!isNaN(Number(expr))) return Number(expr);
        if (expr === "true") return true;
        if (expr === "false") return false;
        if (expr === "nil") return "nil";

        return expr;
    }

    return expr;
}

function splitBinaryOperands(content) {
    let parenCount = 0;
    let start = 0;

    while (start < content.length && content[start] === " ") {
        start++;
    }

    for (let i = start; i < content.length; i++) {
        const char = content[i];

        if (char === "(") {
            parenCount++;
        } else if (char === ")") {
            parenCount--;
        } else if (char === " " && parenCount === 0) {
            const left = content.substring(start, i).trim();
            const right = content.substring(i + 1).trim();
            return { left, right };
        }
    }

    return { left: null, right: null };
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
    if (result === null || (result && result.error)) {
        process.exit(65);
    }

    if (result) {
        console.log(result);
    }
} else if (command == "evaluate") {
    const tokens = tokenizer(fileContent);
    if (foundError) process.exit(65);

    const expr = parseExpression(tokens);
    if (expr === null || expr.error) {
        process.exit(65);
    }

    console.log(evaluateExpr(expr));
}
