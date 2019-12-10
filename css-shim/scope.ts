import {parse} from './css-parser'
import {CSSScope} from './interfaces'
import {getSelectors, getSelectorsForScopes, resolveValues} from './selectors'
import {compileTemplate, executeTemplate} from './template'


export function parseCSS(original: string): CSSScope {
	const ast = parse(original)
	const template = compileTemplate(original)
	const selectors = getSelectors(ast)
	return {
		original,
		template,
		selectors,
		usesCssVars: template.length > 1
	}
}

export function addGlobalStyle(globalScopes: CSSScope[], styleEl: HTMLStyleElement) {
	if (globalScopes.some(css => css.styleEl === styleEl)) {
		return false
	}
	let css
	if(styleEl.textContent) {
      css = parseCSS(styleEl.textContent)
      css.styleEl = styleEl
      globalScopes.push(css)
    }
	return true
}

export function updateGlobalScopes(scopes: CSSScope[]) {
	const selectors = getSelectorsForScopes(scopes)
	const props = resolveValues(selectors)
	scopes.forEach(scope => {
		if (scope.usesCssVars) {
			if (scope.styleEl) {
				scope.styleEl.textContent = executeTemplate(scope.template, props)
			}
		}
	})
}

export function reScope(scope: CSSScope, scopeId: string): CSSScope {

	const template = scope.template.map(segment => {
		return (typeof segment === 'string')
			? replaceScope(segment, scope.scopeId, scopeId)
			: segment
	})

	const selectors = scope.selectors.map(sel => {
		return {
			...sel,
			selector: replaceScope(sel.selector, scope.scopeId, scopeId)
		}
	})

	return {
		...scope,
		template,
		selectors,
		scopeId,
	}
}

export function replaceScope(original: string, oldScopeId: string | undefined, newScopeId: string) {
	original = replaceAll(original, `\\.${oldScopeId}`, `.${newScopeId}`)
	return original
}

export function replaceAll(input: string, find: string, replace: string) {
	return input.replace(new RegExp(find, 'g'), replace)
}
