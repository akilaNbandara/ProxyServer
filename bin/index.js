#!/usr/bin/env node

const readline = require("readline");
console.log( "Starting Proxy Server!" );


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
	prompt: 'ProxyServer> '
});

rl.prompt();

rl.on('line', (answer) => {
  // TODO: Log the answer in a database
  rl.write(`Running proxy server on -> ${answer}`);
	rl.prompt(true);
	
	
	if (answer === "exit") {
		readline.clearLine(process.stdout, 0);
		rl.close();
	}
});