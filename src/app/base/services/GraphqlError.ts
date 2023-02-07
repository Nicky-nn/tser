const validateGraphQlError = (e: Error): any => {
  try {
    const parsed = JSON.parse(JSON.stringify(e, undefined, 2))
    return {
      status: parsed.response?.errors[0]?.extensions.exception.status || 400,
      message: parsed.response?.errors[0]?.message || 'Error no definido',
      originalMessage:
        parsed.response?.errors[0]?.extensions.exception.originalMessage || '',
      stacktrace: `<code>${
        parsed.response?.errors[0]?.extensions?.exception?.stacktrace?.join('') || ''
      }</code>`,
      type: parsed.response?.errors[0]?.extensions?.exception?.type || 'BAD_REQUEST',
      path: parsed.response?.errors[0]?.path[0] || '',
    }
  } catch (e: any) {
    return {
      status: 400,
      message: e.message,
      originalMessage: e.message,
      stacktrace: `<pre></pre>`,
      type: 'BAD_REQUEST',
      path: 'frontEnd',
    }
  }
}

export class MyGraphQlError extends Error {
  constructor(e: Error) {
    const errors = validateGraphQlError(e)
    super(errors.message) // (1)
    this.name = `${errors.status} ${errors.type} (${errors.path})` // (2)
    this.stack = errors.stacktrace
    this.cause = errors.originalMessage
  }
}
