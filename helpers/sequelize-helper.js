const cls = require('cls-hooked')
const _ = require('lodash')

const { BadRequestError } = require('../lib/errors')

let clsNamespace

/**
 * required validators always take place. i.e, INTEGER
 * but optional validators only work with dateTypes with options. i.e, INTEGER(5)
 * @param typeName: Date type name CAPITALIZED
 * @param userOpts: custom options
 * @param typeOpts: Type options that sequelize generates when calling a data type. i.e, INTEGER(5)
 */
function getFieldDefaults (typeName, userOpts, typeOpts) {
  const defaultOpts = typeOpts || {}

  const INTEGER = {
    validators: {
      required: {
        isInt: true
      },
      optional: {
        len: [0, defaultOpts.length]
      }
    }
  }

  const STRING = {
    validators: {
      optional: {
        len: [0, defaultOpts.length]
      }
    }
  }

  const fieldMap = {
    INTEGER,
    TINYINT: INTEGER,
    SMALLINT: INTEGER,
    STRING,
    TEXT: STRING,
    CHAR: STRING,
    DATE: {
      validators: {
        required: {
          // `isDate` is not enough as it's not working with values like `111`
          // It consider it valid and lead to db error 'conversion of nvarchar
          // to smalldatetime is out-of-range value.'
          isValidDate (val) {
            if (val && !(val instanceof Date) && isNaN(Date.parse(val))) {
              throw new Error('Invalid Date!')
            }
          },
          isDate: true
        }
      }
    },
    DECIMAL: {
      validators: {
        required: {
          isDecimal: [defaultOpts.precision, defaultOpts.scale]
        }
      }
    },
    BOOLEAN: {
      validators: {
        required: {
          isBoolean: true
        }
      }
    },
    BLOB: { },
    VIRTUAL: { },
    JSONB: {
      validators: {
        required: {
          isJSON (val) {
            if (!_.isNil(val) && !(_.isPlainObject(val) || Array.isArray(val))) {
              throw new BadRequestError('Invalid JSON')
            }
          }
        }
      }
    }
  }

  const field = fieldMap[typeName]
  if (!field) {
    throw new Error(`SequelizeHelper: ${typeName} field is not supported!`)
  }

  const readyOpts = _.defaults({ }, userOpts, field.defaultOptions)

  return {
    readyOpts,
    validators: {
      ...(_.get(field, 'validators.required') || {}),
      ...((typeOpts && _.get(field, 'validators.optional')) || {})
    }
  }
}

module.exports = class SequelizeHelper {
  static field (type, options = {}) {
    const allowNull = typeof options.allowNull !== 'undefined' ? options.allowNull : true
    const typeName = typeof type === 'function' ? type.name : type.constructor.name
    if (options.primaryKey) {
      return {
        type,
        allowNull: false,
        autoIncrement: true,
        ...options
      }
    }

    const { validators = { }, readyOpts } = getFieldDefaults(typeName, options, type.options)

    // Show custom message if the notNull constrain fails
    if (!allowNull && options.isNullMsg) {
      validators.notNull = {
        msg: options.isNullMsg
      }
    }

    return {
      type,
      allowNull,
      ...readyOpts,
      validate: {
        ...validators,
        ...(readyOpts.validate || {})
      }
    }
  }

  static getTransaction (sequelize, cb) {
    return clsNamespace && clsNamespace.get('transaction') ? cb() : sequelize.transaction(cb)
  }

  static getClsNamespace () {
    if (clsNamespace) return clsNamespace
    clsNamespace = cls.createNamespace('sequelize-transaction-namespace')
    return clsNamespace
  }

  static getModelDefaults (Model, sequelize, opts) {
    const defaultObj = {
      sequelize,
      tableName: Model.name
    }

    return {
      ...defaultObj,
      ...opts
    }
  }
}
