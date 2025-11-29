// IDEAS: \\
// 1. pop-up on start: hello <name>, ready for a quick focusing session? ready for today's work? ready for making dreams comes true..
// 2. tomato icon, view options
// 3. quick session, start a 25 mins session
// 4. commands that set the session time and the break times (short and long breaks), and how many sessions in an Interval
// interval = n * [session + break] followd by a long break
// 5. cheerish message about how much time you have spent, with analogies to motivate
// side window for those statistics
// 6. command to open the extension repository vscode.env.openExternal. READ THE API
// 7. implement issue reporter command: https://code.visualstudio.com/api/get-started/wrapping-up#issue-reporting
// 8. for more UI friendly extension, use *tree view container*, *tree view*
// 



// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let countDown

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const pomoCodeQuickSessionCMD = "pomocode.quickSession"
	const pomoCodeStopTimerCMD = "pomocode.stopTimer" // TODO
	const quickSessionDefaultMinutes = 25

	const statusBarTomato = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000)
	statusBarTomato.text = "🍅"
	statusBarTomato.name = "Pomocode Tomato"
	statusBarTomato.tooltip = "Start a Quick Pomocode Session"
	statusBarTomato.command = pomoCodeQuickSessionCMD
	statusBarTomato.show()

	const statusBarTimer = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1050)
	statusBarTimer.name = "Pomocode Timer"
	statusBarTimer.tooltip = "Stop the Timer"
	statusBarTimer.command = pomoCodeStopTimerCMD // TODO

	// TODO: fix the "pressing the timer twice" problem
	vscode.commands.registerCommand("pomocode.quickSession", () => {
		timer(statusBarTimer, quickSessionDefaultMinutes)
	})

	context.subscriptions.push(statusBarTomato)
	context.subscriptions.push(statusBarTimer)

	

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
		vscode.window.showQuickPick(["this", "that", "those", "these"])
		vscode.window.showWarningMessage("WHAT DID YOU DOOOOOO")
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('pomocode.testPomocode', () => {
		timer(0.1)
		vscode.window.showInformationMessage('check the console')
	})
	context.subscriptions.push(disposable)
}

const timer = async (statusBarTimer, minutes) => {

	if (countDown) {
		let yesMessage = "Replace"
		let noMessage = "No"
		let reset = await vscode.window.showWarningMessage("There is already a working timer. Replace it?",
			yesMessage,
			noMessage
		)

		if (reset === noMessage) {
			return
		}

	}

	clearInterval(countDown)

	const pad = (num) => num.toString().padStart(2, "0")

	let totalSeconds = minutes * 60

	const displayTime = (secs) => {
		const hours = Math.floor(secs / 3600);
		const minutes = Math.floor((secs % 3600) / 60);
		const seconds = secs % 60;
		statusBarTimer.text = `${hours ? hours + ":" : ""}${pad(minutes)}:${pad(seconds)}`
	}

	const tick = () => {
		if (totalSeconds < 0) {
			clearInterval(countDown)
			vscode.window.showInformationMessage("🍅 Time's UP, Great Job!")
			statusBarTimer.hide()
			countDown = null
			return
		}

		statusBarTimer.show()
		displayTime(totalSeconds)
		totalSeconds--
	}

	countDown = setInterval(tick, 1000)
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
