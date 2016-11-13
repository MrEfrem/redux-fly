import React from 'react'
import { mount } from 'enzyme'
import Counter from './Counter'

function setup() {
  const component = mount(
    <Counter />
  )

  return {
    buttons: component.find('button'),
    p: component.find('p')
  }
}

describe('Counter component', () => {
  it('should display count', () => {
    const { p } = setup()
    expect(p.text()).toMatch(/^Clicked: 0 times/)
  })

  it('first button should increment counter', () => {
    const { buttons, p } = setup()
    buttons.at(0).simulate('click')
    expect(p.text()).toMatch(/^Clicked: 1 times/)
  })

  it('second button should decrement counter', () => {
    const { buttons, p } = setup()
    buttons.at(1).simulate('click')
    expect(p.text()).toMatch(/^Clicked: -1 times/)
  })

  it('third button should not increment counter if the counter is even', () => {
    const { buttons, p } = setup()
    buttons.at(2).simulate('click')
    expect(p.text()).toMatch(/^Clicked: 0 times/)
  })

  it('third button should increment counter if the counter is odd', () => {
    const { buttons, p } = setup()
    buttons.at(0).simulate('click')
    buttons.at(2).simulate('click')
    expect(p.text()).toMatch(/^Clicked: 2 times/)
  })

  it('third button should increment counter if the counter is odd and negative', () => {
    const { buttons, p } = setup()
    buttons.at(1).simulate('click')
    expect(p.text()).toMatch(/^Clicked: -1 times/)
    buttons.at(2).simulate('click')
    expect(p.text()).toMatch(/^Clicked: 0 times/)
  })

  it('fourth button should increment counter in a second', (done) => {
    const { buttons, p } = setup()
    buttons.at(3).simulate('click')
    setTimeout(() => {
      expect(p.text()).toMatch(/^Clicked: 1 times/)
      done()
    }, 1000)
  })
})
