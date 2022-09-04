module.exports = class ProductFixtures {
  static getProduct ({ hasCode = true, hasImage = true } = { }) {
    const fixture = {
      name: 'Prod 1',
      category: 'Cat 1',
      price: 100,
      quantity: 5,
      discount: 15
    }

    if (hasCode) fixture.code = 'p1'
    if (hasImage) fixture.image = 'prod-picture.jpg'

    return fixture
  }
}
