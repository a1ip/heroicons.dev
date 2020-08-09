import dataset from "./dataset"
import { useImmerReducer } from "use-immer"

import CodeSolidSVG from "heroicons-82f6a4d/react/solid/Code"
import SwitchHorizontalSolidSVG from "heroicons-82f6a4d/react/solid/SwitchHorizontal"

// Generates a 4-character hash.
function shortHash() {
	return Math.random().toString(16).slice(2, 6)
}

const initialState = {
	form: {
		originalSearch: "",
		search: "",
		copyAsReact: false,
		showOutline: false,
	},
	notif: {
		visible: "", // NOTE: Uses a key.
		notifType: "",
		notifInfo: null,
	},
	results: dataset,
}

const actions = state => ({

	/*
	 * state.form
	 */
	internalResetSearch() {
		state.form.originalSearch = ""
		state.form.search = ""
		state.results = dataset
	},
	// internalPerformSearchNew() {
	// 	state.dataset.filter(each => each.statusNew)
	// },
	updateFormSearch(text) {
		if (!text) {
			this.internalResetSearch()
			return
		}
		state.form.originalSearch = text
		state.form.search = text.toLowerCase().replace(/ /g, "-")
		if (state.form.search === "new") {
			state.results = dataset.filter(each => each.statusNew)
			return
		}
		state.results = dataset.filter(each => {
			each.searchIndex = each.name.indexOf(state.form.search)
			return each.searchIndex >= 0
		})
		state.results.sort((a, b) => {
			return a.searchIndex - b.searchIndex
		})
	},
	toggleFormCopyAsReact() {
		state.form.copyAsReact = !state.form.copyAsReact
		this.updateNotification("form-jsx", {
			name: "code",
			icon: CodeSolidSVG,
		})
	},
	toggleFormShowOutline() {
		state.form.showOutline = !state.form.showOutline
		this.updateNotification("form-alt", {
			name: "switch-horizontal",
			icon: SwitchHorizontalSolidSVG,
		})
	},

	/*
	 * state.notif
	 */
	updateNotification(notifType, notifInfo) {
		state.notif.visible = notifInfo.icon.name + "-" + shortHash()
		state.notif.notifType = notifType
		state.notif.notifInfo = notifInfo
	},
	hideNotification() {
		state.notif.visible = ""
	},

})

function HeroiconsReducer(state, action) {
	switch (action.type) {
	case "UPDATE_FORM_SEARCH":
		actions(state).updateFormSearch(action.text)
		return
	case "TOGGLE_FORM_COPY_AS_REACT":
		actions(state).toggleFormCopyAsReact()
		return
	case "TOGGLE_FORM_SHOW_OUTLINE":
		actions(state).toggleFormShowOutline()
		return
	case "UPDATE_NOTIFICATION":
		actions(state).updateNotification(action.notifType, action.notifInfo)
		return
	case "HIDE_NOTIFICATION":
		actions(state).hideNotification()
		return
	default:
		throw new Error(`HeroiconsReducer: type mismatch; action.type=${action.type}`)
	}
}

function useHeroiconsReducer() {
	return useImmerReducer(HeroiconsReducer, {}, () => initialState)
}

export default useHeroiconsReducer
