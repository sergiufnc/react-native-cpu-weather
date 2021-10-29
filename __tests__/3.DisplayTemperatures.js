import React from "react"
import renderer from 'react-test-renderer'
import App from "../App";

describe('<App />', () => {
	test('it has 1 child', () => {
		//const AppMounted = App()

		const tree = renderer.create(<App/>)

		expect(tree.children.length).toBe(1)
	})
})