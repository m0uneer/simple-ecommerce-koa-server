const Utils = require('./utils')

describe('Utils functions', () => {
  it('.pick should return correct object', () => {
    const data = { k: { v: { d: [1, 2] } }, a: 1, b: '3' }
    expect(Utils.pick(data, ['k', 'v', 'd', 'a', 'foo'])).toEqual({ k: { v: { d: [1, 2] } }, a: 1 })
  })
})
