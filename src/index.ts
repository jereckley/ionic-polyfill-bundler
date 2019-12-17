import * as path from 'path'
import * as fs from 'fs'

// order of the polyfills matters!! test test test
// actual source of the polyfills are found in /src/client/polyfills/
const INLINE_POLYFILLS = [
	'promise.js',
	'core-js.js',
	'dom.js',
	'es5-html-element.js',
	'system.js'
];


export async function getClientPolyfill(polyfillFile: string) {
	const polyfillFilePath = path.join(
		path.resolve(__dirname),'../../prepped', polyfillFile
	);
	console.log(polyfillFilePath)
	const fileContents = fs.readFileSync(polyfillFilePath,'utf8');
	console.log(fileContents)
	return fileContents
}

export async function getAppBrowserCorePolyfills() {
	// read all the polyfill content, in this particular order
	const results = await Promise.all(
		INLINE_POLYFILLS
			.map(polyfillFile => getClientPolyfill(polyfillFile))
	);

	// concat the polyfills
	return results.join('\n').trim();
}

async function getSystemLoader() {
	const polyfills = await getAppBrowserCorePolyfills();
	return `
'use strict';
(function () {

  if (/Edge\\/\\d./i.test(navigator.userAgent)) {

    ${polyfills}
    // Note: using .call(window) here because the self-executing function needs
    // to be scoped to the window object for the ES6Promise polyfill to work
  }
}).call(window);
`;
}

export async function writeSystemLoader() {

	const loaderContent = await getSystemLoader();
	return await fs.writeFileSync('./poly/ionic-polyfill.js', loaderContent)
}
writeSystemLoader()
