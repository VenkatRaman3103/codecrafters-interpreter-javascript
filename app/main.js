import fs from "fs";

const args = process.argv.slice(2);

if (args.length < 2) {
    console.error("Usage: ./your_program.sh tokenize <filename>");
    process.exit(1);
}

let foundError = false;

// command
const command = args[0];

if (command !== "tokenize") {
    console.error(`Usage: Unknown command: ${command}`);
    process.exit(1);
}

// tokenizer
function tokenizer(fileContent, lineNumber) {
    for (let cursor = 0; cursor < fileContent.length; cursor++) {
        let char = fileContent[cursor];

        if (char === "(") {
            console.log("LEFT_PAREN ( null");
        } else if (char === ")") {
            console.log("RIGHT_PAREN ) null");
        } else if (char === "{") {
            console.log("LEFT_BRACE { null");
        } else if (char === "}") {
            console.log("RIGHT_BRACE } null");
        } else if (char === "*") {
            console.log("STAR * null");
        } else if (char === ".") {
            console.log("DOT . null");
        } else if (char === ",") {
            console.log("COMMA , null");
        } else if (char === "+") {
            console.log("PLUS + null");
        } else if (char === "-") {
            console.log("MINUS - null");
        } else if (char === ";") {
            console.log("SEMICOLON ; null");
        } else if (char == "=") {
            if (fileContent[cursor + 1] == "=") {
                console.log("EQUAL_EQUAL == null");
                cursor++;
            } else {
                console.log("EQUAL = null");
            }
        } else if (char == "!") {
            if (fileContent[cursor + 1] == "=") {
                console.log("BANG_EQUAL != null");
                cursor++;
            } else {
                console.log("BANG ! null");
            }
        } else if (char == "<") {
            if (fileContent[cursor + 1] == "=") {
                console.log("LESS_EQUAL <= null");
                cursor++;
            } else {
                console.log("LESS < null");
            }
        } else if (char == ">") {
            if (fileContent[cursor + 1] == "=") {
                console.log("GREATER_EQUAL >= null");
                cursor++;
            } else {
                console.log("GREATER > null");
            }
        } else if (char == "/") {
            if (fileContent[cursor + 1] == "/") {
                cursor++;
                while (char !== "\n" && cursor < fileContent.length) {
                    char = fileContent[cursor];
                    cursor++;
                }
            } else {
                console.log("SLASH / null");
            }
        } else if (
            char === " " ||
            char === "\t" ||
            char === "\r" ||
            char === "\n"
        ) {
            continue;
        } else {
            console.error(
                `[line ${lineNumber}] Error: Unexpected character: ${char}`,
            );
            foundError = true;
        }
    }
}

// file path
const filename = args[1];

const fileContent = fs.readFileSync(filename, "utf8");

if (fileContent.length !== 0) {
    let lines = fileContent.split("\n");

    for (let line = 0; line < lines.length; line++) {
        tokenizer(lines[line], line + 1);
    }
    console.log("EOF  null");

    if (foundError) {
        process.exit(65);
    }
} else {
    console.log("EOF  null");
}
