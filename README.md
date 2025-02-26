# Java File Icons

A VSCode extension that identifies different types of Java files (class, interface, enum, abstract class) and changes their file icons accordingly.

## Features

- Automatically detects Java file types based on their content
- Provides distinct icons for different Java file types:
  - Regular classes (orange)
  - Interfaces (blue)
  - Enums (green)
  - Abstract classes (red)
- Updates icons in real-time as you edit Java files
- Includes a command to manually refresh all Java file icons

## How It Works

The extension analyzes the content of Java files to determine their type:

1. **Class files**: Files containing `class` declarations
2. **Interface files**: Files containing `interface` declarations
3. **Enum files**: Files containing `enum` declarations
4. **Abstract class files**: Files containing `abstract class` declarations

## Usage

1. Install the extension
2. Open a Java project
3. The extension will automatically detect and assign appropriate icons to your Java files
4. If needed, you can manually refresh the icons using the "Refresh Java File Icons" command

## Commands

- **Refresh Java File Icons**: Manually refreshes the icons for all Java files in the workspace

## Requirements

- VSCode 1.97.0 or higher

## Extension Settings

This extension doesn't add any settings.

## Known Issues

- The extension may need to reload the window to apply icon changes
- In large projects, the initial icon assignment may take some time

## Release Notes

### 0.0.1

Initial release of Java File Icons extension.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the MIT License.
