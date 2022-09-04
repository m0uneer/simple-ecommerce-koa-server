const Config = require('config')

const Product = require('../models/product')
const { NotFoundError, BadRequestError } = require('../../../lib/errors')
const Messages = require('../constants/messages')
const ValidationService = require('../../../lib/validation-service')
const ProductSchemas = require('../schemas/product-schemas')
const StorageProvider = require('../../../lib/storage/storage-provider').getProvider()

module.exports = class ProductService {
  constructor (productModel, storageProvider) {
    this.Product = productModel
    this.StorageProvider = storageProvider
  }

  static init () {
    return new ProductService(Product, StorageProvider)
  }

  async addProduct (data, img) {
    if (!img) throw new BadRequestError(Messages.imageRequired)
    const product = ValidationService.validate(ProductSchemas.addProduct, data)
    const lastProd = await this.Product.findOne({ order: [['createdAt', 'DESC']] })
    let code = lastProd ? Number(lastProd.code.replace('p', '')) : 0

    try {
      const folderName = Config.get('Assets.ProductImagesDirName')
      const newFileName = `${folderName}/${Date.now()}-${img.originalname}`
      const createdProduct = await this.Product
        .create({ ...product, code: `p${++code}`, image: newFileName })

      await this.StorageProvider.uploadBatch('', [{ data: img.buffer, name: newFileName }])
      return createdProduct
    } catch (err) {
      const codeUniqErr = err
        .errors?.find(err => err.path === 'code' && err.type === 'unique violation')

      if (codeUniqErr) return this.addProduct(product, img)
      throw err
    }
  }

  async updateProduct (productId, data) {
    const product = ValidationService.validate(ProductSchemas.updateProduct, data)
    const prod = await this.Product.findByPk(productId)
    if (!prod) throw new NotFoundError(Messages.productNotFound)
    return this.Product.update(product, { where: { id: productId } })
  }

  async deleteProduct (productId) {
    const rowCount = await this.Product.destroy({ where: { id: productId } })
    if (rowCount === 0) throw new NotFoundError(Messages.productNotFound)
    return this.Product.findAll()
  }

  async listProducts () {
    const productList = await this.Product.findAll()
    return Promise.all(productList.map(async prod => {
      prod.image = await this.StorageProvider.getUrl('', prod.image)
      return prod
    }))
  }

  async getProduct (productId) {
    const prod = await this.Product.findByPk(productId)
    if (!prod) throw new NotFoundError(Messages.productNotFound)
    return prod
  }
}
