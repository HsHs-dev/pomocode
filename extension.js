// IDEAS: \\
// 1. pop-up on start: hello <name>, ready for a quick focusing session? ready for today's work? ready for making dreams comes true..
// 2. tomato icon, view options
// 3. quick session, start a 25 mins session
// 4. commands that set the session time and the break times (short and long breaks), and how many sessions in an Interval
// interval = n * [session + break] followd by a long break
// 5. cheerish message about how much time you have spent, with analogies to motivate
// side window for those statistics
// 6. command to open the extension repository vscode.env.openExternal. READ THE API
// 7. 



// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pomocode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('pomocode.helloVSCode', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Pomocode!');
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('pomocode.testPomocode', () => {
		timer(8000)
		vscode.window.showInformationMessage('check the console')
	})
	context.subscriptions.push(disposable)
}

const timer = (minutes) => {

	const minutesToAdd = minutes
	const afterMinutes = new Date(Date.now() + (minutesToAdd * 60 * 1000)).getTime()

	const pad = (num) => num.toString().padStart(2, "0")

	let lastTotalSeconds = null

	const tick = () => {

		const diff = afterMinutes - Date.now()

		if (diff < 0) {
			clearInterval(countDown)
			console.log('times up')
			return
		}

		const totalSeconds = Math.floor(diff / 1000);

		// check if 1 second passed
		if (lastTotalSeconds === totalSeconds) return
		lastTotalSeconds = totalSeconds

		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		console.log(`${hours ? hours + ":" : ""}${pad(minutes)}:${pad(seconds)}`)
	}

	// fire the timer right away
	tick()
	// using less time interval for more accuracy
	const countDown = setInterval(tick, 100)

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
