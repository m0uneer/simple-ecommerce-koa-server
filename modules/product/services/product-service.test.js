const Path = require('path')
const Fs = require('fs')
const _ = require('lodash')
const SequelizeMock = require('sequelize-mock')

const ProductService = require('./product-service')
const ProductFixtures = require('../fixtures/product-fixtures')

const fixtureImage = Fs.readFileSync(Path.join(__dirname, '/../fixtures/empty-image.png'))
const { BadRequestError } = require('../../../lib/errors')

const DBConnectionMock = new SequelizeMock()
const productMock = DBConnectionMock.define('Product', ProductFixtures.getProduct())
const storageProviderMock = { uploadBatch: _.noop, getUrl: _.noop }
const productService = new ProductService(productMock, storageProviderMock)

const productCreateSpy = jest.spyOn(productMock, 'create')

describe('ProductService', () => {
  describe('Adding new product', () => {
    it('should fail if image is missing', () => {
      return expect(productService.addProduct(ProductFixtures.getProduct()))
        .rejects.toBeInstanceOf(BadRequestError)
    })

    it('should fail if data is not valid', async () => {
      const data = ProductFixtures.getProduct({ hasCode: false, hasImage: false })
      data.price = 'invalid value'
      const addProductProm = productService.addProduct(data, fixtureImage)
      await expect(addProductProm).rejects.toBeInstanceOf(BadRequestError)
      return expect(addProductProm).rejects.toHaveProperty('message', '"price" must be a number')
    })

    it('should generate product code successfully', async () => {
      const data = ProductFixtures.getProduct({ hasCode: false, hasImage: false })
      await productService.addProduct(data, fixtureImage)
      const lastProductCreateCall = _.last(productCreateSpy.mock.calls)
      expect(lastProductCreateCall[0]).toMatchObject({ code: 'p2' })
    })

    it('should handle product code unique error', async () => {
      productCreateSpy.mockImplementationOnce(() => {
        const err = new Error()
        err.errors = [{ path: 'code', type: 'unique violation' }]
        throw err
      })

      const data = ProductFixtures.getProduct({ hasCode: false, hasImage: false })
      const addProductSpy = jest.spyOn(productService, 'addProduct')
      await productService.addProduct(data, fixtureImage)
      expect(addProductSpy.mock.calls).toHaveLength(2)
      productCreateSpy.mockRestore()
    })

    it('should create product and save image successfully', async () => {
      const data = ProductFixtures.getProduct({ hasCode: false, hasImage: false })
      const uploadBatchSpy = jest.spyOn(storageProviderMock, 'uploadBatch')
      const addProductProm = productService.addProduct(data, fixtureImage)
      await expect(addProductProm).resolves.toBeInstanceOf(productMock.Instance)
      expect(uploadBatchSpy.mock.calls).toHaveLength(1)
    })
  })
})
