import warning from '../utils/warning'

export const registerReducersCheckDetailOptions = (defaultOptions, options) => {
  if (typeof options.replaceReducers !== 'boolean') {
    throw new Error('Option replaceReducers must be boolean')
  }
  if (typeof options.replaceIfMatch !== 'boolean') {
    throw new Error('Option replaceIfMatch must be boolean')
  }
  if (process.env.NODE_ENV !== 'production') {
    const undefinedOptions = Object.keys(options).reduce((prev, next) => {
      if (!defaultOptions.includes(next)) {
        prev = `${prev}, `
      }
      return prev
    }, '').slice(0, -2)
    if (undefinedOptions) {
      warning(`Undefined options: ${undefinedOptions}`)
    }
  }
}
