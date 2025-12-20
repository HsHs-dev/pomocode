// IDEAS: \\
// 1. pop-up on start: hello <name>, ready for a quick focusing session? ready for today's work? ready for making dreams comes true..
// 2. tomato icon, view options
// 3. quick session, start a 25 mins session
// 4. commands that set the session time and the break times (short and long breaks), and how many sessions in an Interval
// interval = n * [session + break] followed by a long break
// 5. cheerish message about how much time you have spent, with analogies to motivate
// side window for those statistics
// 6. command to open the extension repository vscode.env.openExternal. READ THE API
// 7. implement issue reporter command: https://code.visualstudio.com/api/get-started/wrapping-up#issue-reporting
// 8. for more UI friendly extension, use *tree view container*, *tree view*
// 9.



// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let countDown
let totalSeconds

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const pomoCodeQuickSessionCMD = "pomocode.quickSession"
	const pomoCodeStopTimerCMD = "pomocode.stopTimer"
	const quickSessionDefaultMinutes = 25

	const statusBarTomato = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000)
	statusBarTomato.text = "🍅"
	statusBarTomato.name = "Pomocode Tomato"
	statusBarTomato.tooltip = "Start a Quick Pomocode Session"
	statusBarTomato.command = pomoCodeQuickSessionCMD
	statusBarTomato.show()

	const statusBarTimer = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1050)
	statusBarTimer.name = "Pomocode Timer"
	statusBarTimer.tooltip = "Stop the timer"
	statusBarTimer.command = pomoCodeStopTimerCMD

	// start quick session
	vscode.commands.registerCommand(pomoCodeQuickSessionCMD, () => {
		timer(statusBarTimer, quickSessionDefaultMinutes)
	})

	// stop the timer
	let stopped
	vscode.commands.registerCommand(pomoCodeStopTimerCMD, () => {
		if (stopped) {
			countDown = null
			statusBarTimer.tooltip = "Stop the timer"
			stopped = false
			timer(statusBarTimer, totalSeconds/60)
			return
		}
		clearInterval(countDown)
		statusBarTimer.text = displayTime(totalSeconds)
		statusBarTimer.tooltip = "Start the timer"
		stopped = true
	})

	context.subscriptions.push(statusBarTomato)
	context.subscriptions.push(statusBarTimer)
}

let breakTaken = false

const timer = async (statusBarTimer, minutes, message) => {

	if (countDown) {
		const yesMessage = "Replace"
		const noMessage = "No"
		const reset = await vscode.window.showWarningMessage("There is already a working timer. Replace it?",
			yesMessage,
			noMessage
		)

		if (reset === noMessage) {
			return
		}
	}

	clearInterval(countDown)
	totalSeconds = minutes * 60
	statusBarTimer.show()

	const tick = async () => {
		if (totalSeconds < 0) {
			clearInterval(countDown)
			countDown = null
			if (message) {
				await vscode.window.showInformationMessage(message)
			} else {
				await vscode.window.showInformationMessage("🍅 Time's UP, Great Job!")
			}
			if (!breakTaken) {
				await shortBreak(statusBarTimer)
			} else {
				breakTaken = false
				statusBarTimer.hide()
			}

			return
		}

		statusBarTimer.text = displayTime(totalSeconds)
		totalSeconds--
	}

	tick()
	countDown = setInterval(() => tick(), 1000)
}

const displayTime = (secs) => {

	const pad = (num) => num.toString().padStart(2, "0")

	const hours = Math.floor(secs / 3600);
	const minutes = Math.floor((secs % 3600) / 60);
	const seconds = secs % 60;
	return `${hours ? hours + ":" : ""}${pad(minutes)}:${pad(seconds)}`
}

const shortBreak = async (statusBarTimer) => {
	const shortBreakDefaultMinutes = 5
	const yesMessage = "Take Break"
	const noMessage = "No"
	const takeBreak = await vscode.window.showInformationMessage(
		"Take a short break?", yesMessage, noMessage
	)

	if (takeBreak === yesMessage) {
		breakTaken = true
		timer(statusBarTimer, shortBreakDefaultMinutes, "🍅 Break is done, Back To Work!")
	} else {
		statusBarTimer.hide()
	}
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
