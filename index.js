const app = require('./app')
const { handleProcessErrors } = require('./lib/process-error-handler')

handleProcessErrors('Simple Ecommerce')
app.startServer()
