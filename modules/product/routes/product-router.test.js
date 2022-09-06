const Path = require('path')
const TestUtils = require('../../../lib/test-utils')
const DbLoader = require('../../../lib/models/db-loader')
const Status = require('../../../lib/response/status')
const Urls = require('../constants/urls')
const ProductFixtures = require('../fixtures/product-fixtures')

beforeAll(async () => {
  await DbLoader.init()
})

afterAll(TestUtils.afterTest)

describe('Product creation', () => {
  it('should add new product', async () => {
    const data = ProductFixtures.getProduct({ hasCode: false, hasImage: false })
    const signedIn = await TestUtils.signIn()
    const imageName = 'empty-image.png'
    const creationRes = await TestUtils
      .sendReqWithFiles(signedIn.post(TestUtils.url(Urls.postProductCreate)),
        { data, files: { image: Path.join(__dirname, `/../fixtures/${imageName}`) } })

    expect(creationRes.status).toBe(Status.ok)
    expect(creationRes.body.messages[0].txt).toBe('Product added successfully.')
    const createdProd = ProductFixtures.getProduct()
    expect(creationRes.body.data).toMatchObject({
      ...createdProd,
      image: expect.stringContaining(imageName)
    })
  })
})
