const Sequelize = require('sequelize')

const { field } = require('./sequelize-helper')

describe('SequelizeHelper.field()', () => {
  it('should build the primaryKey field properly', () => {
    const type = Sequelize.DataTypes.INTEGER
    const modelField = field(type, { allowNull: false, primaryKey: true })
    expect(modelField).toEqual({ type, allowNull: false, autoIncrement: true, primaryKey: true })
  })

  it('should set default allowNull', () => {
    const modelField = field(Sequelize.DataTypes.INTEGER)
    expect(modelField.allowNull).toBe(true)
  })

  it('should set default validation rules for types with/out options', () => {
    // Type without options
    const type = Sequelize.DataTypes.INTEGER
    const modelField = field(type)
    expect(modelField).toEqual({ type, allowNull: true, validate: { isInt: true } })

    // Type with options
    const typeWithOpts = Sequelize.DataTypes.INTEGER(5)
    const modelFieldWithOpts = field(typeWithOpts)
    expect(modelFieldWithOpts)
      .toEqual({ type: typeWithOpts, allowNull: true, validate: { isInt: true, len: [0, 5] } })
  })

  it('should throw if field type is not supported', () => {
    expect(() => field('NotSupportedField')).toThrow()
  })

  it('should set custom message for notNull failure if allowNull is false with isNullMsg', () => {
    const isNullMsg = 'msg'
    const modelField = field(Sequelize.DataTypes.INTEGER, { allowNull: false, isNullMsg })
    expect(modelField.validate.notNull.msg).toBe(isNullMsg)

    const nullModelField = field(Sequelize.DataTypes.INTEGER, { allowNull: true, isNullMsg })
    expect(nullModelField.validate.notNull).toBeUndefined()
  })

  it('should override any helper configurations if user options are passed', () => {
    const type = Sequelize.DataTypes.INTEGER
    const primModelField = field(type, { allowNull: false, primaryKey: true, autoIncrement: false })
    expect(primModelField.autoIncrement).toBe(false)

    const modelField = field(type, { allowNull: false, validate: { isInt: false } })
    expect(modelField.validate.isInt).toBe(false)
  })
})
