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
  var doc = document;
  var currentScript = doc.currentScript;

  // Safari 10 support type="module" but still download and executes the nomodule script
  if (!currentScript || !currentScript.hasAttribute('nomodule') || !('onbeforeload' in currentScript)) {

    ${polyfills}

    // Figure out currentScript (for IE11, since it does not support currentScript)
    var regex = /\\/${'ionic'}(\\.esm)?\\.js($|\\?|#)/;
    var scriptElm = currentScript || Array.from(doc.querySelectorAll('script')).find(function(s) {
      return regex.test(s.src) || s.getAttribute('data-stencil-namespace') === "${'ionic'}";
    });

    var resourcesUrl = scriptElm ? scriptElm.getAttribute('data-resources-url') || scriptElm.src : '';
    var start = function() {
      var url = new URL('http://', resourcesUrl);
      console.log(url)
      System.import(url.href);
    };

    if (win.__stencil_cssshim) {
      win.__stencil_cssshim.initShim().then(start);
    } else {
      start();
    }

    // Note: using .call(window) here because the self-executing function needs
    // to be scoped to the window object for the ES6Promise polyfill to work
  }
}).call(window);
`;
}

export async function writeSystemLoader() {

	const loaderContent = await getSystemLoader();
	return await fs.writeFileSync('./poly/ionic-config-polyfill.js', loaderContent)
}
writeSystemLoader()
