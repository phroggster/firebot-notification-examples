# Description
This is an example script for Firebot alerts and notifications. While the script can be installed and utilized by end-users, it's intended more as an implementation guide for developers seeking similar behavior in their own scripts.


### Building
Dev:
1. `npm install`
2. `npm run build:dev`
- This will automatically copy the script to your Firebot profile scripts folder.

Release:
1. `npm install`
2. `npm run build`
- You will need to manually copy the .js file from `/dist`.

Other Build Targets:

| Target             | Description                                                                        |
|--------------------|------------------------------------------------------------------------------------|
| `npm run lint`     | Runs the linter, providing useful warnings and errors if I've screwed anything up. |
| `npm run lint:fix` | Runs the linter with the `--fix` parameter, which *might* fix some issues.         |
| `npm run test`     | Executes the test suite that is provided for the script.                           |
