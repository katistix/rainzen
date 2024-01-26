// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import player from 'play-sound';
import * as path from 'path';
import { ChildProcess } from 'child_process'; // Import ChildProcess

export function activate(context: vscode.ExtensionContext) {

	// Create a new player
	const audio = player({});
	let audioProcess: ChildProcess | null = null; // Variable to hold the audio process
	let isPlaying = false;
	let musicpath = path.join(__dirname, `../sounds/rain1.mp3`);

	// Create a new status bar item
	let statusBarToggle = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarToggle.command = 'rainzen.toggleRain';
	statusBarToggle.tooltip = 'Play Rain Sounds';
	statusBarToggle.text = `$(cloud) RainZen`;
	statusBarToggle.show();


	const playSound = () => {
		if (isPlaying) {return;} // Guarding if statement

		isPlaying = true;
		statusBarToggle.tooltip = 'Stop Rain Sounds';
		statusBarToggle.text = `$(cloud) Rain (Playing)`;
		// vscode.window.showInformationMessage('Playing rain sounds');

		audioProcess = audio.play(musicpath, (err: any) => {
			if (err) {
				vscode.window.showErrorMessage('Error playing rain sounds');
			}
		});
	};


	const stopSound = () => {
		if (!isPlaying) {return;} // Guarding if statement

		if (audioProcess && !audioProcess.killed) {
			audioProcess.kill();
			audioProcess = null;
		}
		isPlaying = false;
		statusBarToggle.tooltip = 'Play Rain Sounds';
		statusBarToggle.text = `$(cloud) Rain`;
		// vscode.window.showInformationMessage('Stopping rain sounds');
	};

	// define the commands
	const toggleCommand = vscode.commands.registerCommand('rainzen.toggleRain', () => {
		isPlaying ? stopSound() : playSound();
	});
	const playCommand = vscode.commands.registerCommand('rainzen.playRain', () => {
		playSound();
	});
	const stopCommand = vscode.commands.registerCommand('rainzen.stopRain', () => {
		stopSound();
	});
	
	// Register the commands
	context.subscriptions.push(toggleCommand);
	context.subscriptions.push(playCommand);
	context.subscriptions.push(stopCommand);

	// Register the status bar item
	context.subscriptions.push(statusBarToggle);


}

// This method is called when your extension is deactivated
export function deactivate() {}
