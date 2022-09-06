const multer = require('@koa/multer')

const AppRouter = require('../../../lib/routes/app-router')
const ProductService = require('../services/product-service').init()
const Urls = require('../constants/urls')
const Messages = require('../constants/messages')

module.exports = class ProductRouter extends AppRouter {
  init (router) {
    router.use(`${this.prefix}/`, (ctx, next) => ctx.isAuthenticated() && next())

    router.get(Urls.getProductList, `${this.prefix}/`, async (ctx) => {
      const list = await ProductService.listProducts()
      ctx.body = this.Result.ok(list)
    })

    router.get(Urls.getProductRead, `${this.prefix}/:productId`, async (ctx) => {
      const product = await ProductService.getProduct(ctx.params.productId)
      ctx.body = this.Result.ok(product)
    })

    const upload = multer().single('image')
    router.post(Urls.postProductCreate, `${this.prefix}/`, upload, async (ctx) => {
      const product = await ProductService.addProduct(ctx.request.body, ctx.file)
      ctx.body = this.Result.ok(product, Messages.productAddedSuccessfully)
    })

    router.put(Urls.putProductUpdate, `${this.prefix}/:productId`, upload, async (ctx) => {
      await ProductService.updateProduct(ctx.params.productId, ctx.request.body)
      ctx.body = this.Result.ok(ctx.request.body, Messages.productUpdatedSuccessfully)
    })

    router.delete(Urls.deleteProductUpdate, `${this.prefix}/:productId`, async (ctx) => {
      const list = await ProductService.deleteProduct(ctx.params.productId)
      ctx.body = this.Result.ok(list, Messages.productDeletedSuccessfully)
    })
  }
}
