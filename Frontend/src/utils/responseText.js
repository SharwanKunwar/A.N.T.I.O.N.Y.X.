export function responseText(data) {
  if (typeof data === 'string') return data
  if (data == null) return 'I received an empty response. Please try again.'
  const value = data.reply ?? data.response ?? data.answer ?? data.message ?? data.content ?? data.result
  if (typeof value === 'string') return value
  if (value != null) return JSON.stringify(value, null, 2)
  return JSON.stringify(data, null, 2)
}
