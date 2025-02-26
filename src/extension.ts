// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Java file types
enum JavaFileType {
	CLASS,
	INTERFACE,
	ENUM,
	ABSTRACT_CLASS,
	UNKNOWN
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Java File Icons extension is now active!');

	// Register the refresh command
	const refreshCommand = vscode.commands.registerCommand('java-file-icons.refreshIcons', () => {
		vscode.window.showInformationMessage('Refreshing Java file icons...');
		updateJavaFileIcons(context);
	});

	// Register a file system watcher to detect changes in Java files
	const javaFileWatcher = vscode.workspace.createFileSystemWatcher('**/*.java');
	
	javaFileWatcher.onDidCreate((uri) => {
		updateJavaFileIcon(uri, context);
	});
	
	javaFileWatcher.onDidChange((uri) => {
		updateJavaFileIcon(uri, context);
	});

	// Initial update of all Java files
	updateJavaFileIcons(context);

	// Add disposables to context
	context.subscriptions.push(refreshCommand, javaFileWatcher);
}

// This method is called when your extension is deactivated
export function deactivate() {}

// Update icons for all Java files in the workspace
async function updateJavaFileIcons(context: vscode.ExtensionContext) {
	const javaFiles = await vscode.workspace.findFiles('**/*.java');
	
	// Create a new fileNames mapping
	const fileNamesMapping: Record<string, string> = {};
	const lightFileNamesMapping: Record<string, string> = {};
	const highContrastFileNamesMapping: Record<string, string> = {};
	
	// Process each Java file
	for (const uri of javaFiles) {
		try {
			const fileContent = await fs.promises.readFile(uri.fsPath, 'utf8');
			const fileType = determineJavaFileType(fileContent);
			
			// Get the relative path to use as a key in the theme file
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders) continue;
			
			const workspaceRoot = workspaceFolders[0].uri.fsPath;
			const relativePath = path.relative(workspaceRoot, uri.fsPath);
			
			// Set the appropriate icon based on file type
			let iconName = '_java_class'; // Default
			
			switch (fileType) {
				case JavaFileType.INTERFACE:
					iconName = '_java_interface';
					break;
				case JavaFileType.ENUM:
					iconName = '_java_enum';
					break;
				case JavaFileType.ABSTRACT_CLASS:
					iconName = '_java_abstract';
					break;
				case JavaFileType.CLASS:
					iconName = '_java_class';
					break;
				default:
					// Use default icon
					break;
			}
			
			// Add to mappings
			fileNamesMapping[relativePath] = iconName;
			lightFileNamesMapping[relativePath] = iconName;
			highContrastFileNamesMapping[relativePath] = iconName;
			
		} catch (error) {
			console.error(`Error processing Java file: ${uri.fsPath}`, error);
		}
	}
	
	// Update the theme file with all mappings at once
	updateIconThemeFile(fileNamesMapping, lightFileNamesMapping, highContrastFileNamesMapping, context);
}

// Update icon for a specific Java file
async function updateJavaFileIcon(uri: vscode.Uri, context: vscode.ExtensionContext) {
	try {
		const fileContent = await fs.promises.readFile(uri.fsPath, 'utf8');
		const fileType = determineJavaFileType(fileContent);
		
		// Get the current theme file
		const themeFilePath = path.join(context.extensionPath, 'fileicons', 'java-file-icons-theme.json');
		let themeFile: any;
		
		try {
			themeFile = JSON.parse(fs.readFileSync(themeFilePath, 'utf8'));
		} catch (error) {
			console.error('Error reading theme file:', error);
			return;
		}
		
		// Get the relative path to use as a key in the theme file
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) return;
		
		const workspaceRoot = workspaceFolders[0].uri.fsPath;
		const relativePath = path.relative(workspaceRoot, uri.fsPath);
		
		// Set the appropriate icon based on file type
		let iconName = '_java_class'; // Default
		
		switch (fileType) {
			case JavaFileType.INTERFACE:
				iconName = '_java_interface';
				break;
			case JavaFileType.ENUM:
				iconName = '_java_enum';
				break;
			case JavaFileType.ABSTRACT_CLASS:
				iconName = '_java_abstract';
				break;
			case JavaFileType.CLASS:
				iconName = '_java_class';
				break;
			default:
				// Use default icon
				break;
		}
		
		// Ensure fileNames objects exist
		if (!themeFile.fileNames) {
			themeFile.fileNames = {};
		}
		if (!themeFile.light.fileNames) {
			themeFile.light.fileNames = {};
		}
		if (!themeFile.highContrast.fileNames) {
			themeFile.highContrast.fileNames = {};
		}
		
		// Update the theme file with the file-specific icon
		themeFile.fileNames[relativePath] = iconName;
		themeFile.light.fileNames[relativePath] = iconName;
		themeFile.highContrast.fileNames[relativePath] = iconName;
		
		// Write the updated theme file
		fs.writeFileSync(themeFilePath, JSON.stringify(themeFile, null, 2));
		
		// Notify VS Code to refresh the icon theme (without reloading the window)
		vscode.commands.executeCommand('workbench.action.refreshWindowTitle');
	} catch (error) {
		console.error(`Error processing Java file: ${uri.fsPath}`, error);
	}
}

// Determine the type of Java file based on its content
function determineJavaFileType(fileContent: string): JavaFileType {
	// Remove comments to avoid false positives
	const contentWithoutComments = fileContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
	
	// Check for interface
	if (/\binterface\s+\w+/.test(contentWithoutComments)) {
		return JavaFileType.INTERFACE;
	}
	
	// Check for enum
	if (/\benum\s+\w+/.test(contentWithoutComments)) {
		return JavaFileType.ENUM;
	}
	
	// Check for abstract class
	if (/\babstract\s+class\s+\w+/.test(contentWithoutComments)) {
		return JavaFileType.ABSTRACT_CLASS;
	}
	
	// Check for regular class
	if (/\bclass\s+\w+/.test(contentWithoutComments)) {
		return JavaFileType.CLASS;
	}
	
	return JavaFileType.UNKNOWN;
}

// Update the icon theme file with the appropriate icons for all files
function updateIconThemeFile(
	fileNamesMapping: Record<string, string>,
	lightFileNamesMapping: Record<string, string>,
	highContrastFileNamesMapping: Record<string, string>,
	context: vscode.ExtensionContext
) {
	try {
		const themeFilePath = path.join(context.extensionPath, 'fileicons', 'java-file-icons-theme.json');
		
		// Read the current theme file
		let themeFile: any;
		try {
			themeFile = JSON.parse(fs.readFileSync(themeFilePath, 'utf8'));
		} catch (error) {
			console.error('Error reading theme file:', error);
			return;
		}
		
		// Update the theme file with all file-specific icons
		themeFile.fileNames = fileNamesMapping;
		themeFile.light.fileNames = lightFileNamesMapping;
		themeFile.highContrast.fileNames = highContrastFileNamesMapping;
		
		// Write the updated theme file
		fs.writeFileSync(themeFilePath, JSON.stringify(themeFile, null, 2));
		
		// Notify VS Code to refresh the icon theme (without reloading the window)
		vscode.commands.executeCommand('workbench.action.refreshWindowTitle');
	} catch (error) {
		console.error('Error updating icon theme file:', error);
	}
}
