import fs from "fs";

const args = process.argv.slice(2);

if (args.length < 2) {
    console.error("Usage: ./your_program.sh tokenize <filename>");
    process.exit(1);
}

// command
const command = args[0];

if (command !== "tokenize") {
    console.error(`Usage: Unknown command: ${command}`);
    process.exit(1);
}

// file path
const filename = args[1];

const fileContent = fs.readFileSync(filename, "utf8");

if (fileContent.length !== 0) {
    // tokenize
    for (let cursor = 0; cursor < fileContent.length; cursor++) {
        let char = fileContent[cursor];

        if (char === "(") {
            console.log("LEFT_PAREN ( null");
        } else if (char === ")") {
            console.log("RIGHT_PAREN ) null");
        }
    }
    console.log("EOF  null");
} else {
    console.log("EOF  null");
}
