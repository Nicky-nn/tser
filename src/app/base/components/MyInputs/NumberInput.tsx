export const numberWithCommas = (x: number | undefined, { userTyping, input }: any) => {
  if (userTyping) {
    return input
  }
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
  return Number(x).toLocaleString('en', options)
}

export const numberWithCommas2 = (
  value: any | undefined,
  { userTyping, input }: any,
  maximumFractionDigits = 2,
) => {
  if (userTyping) {
    return input
  }
  const options = {
    minimumFractionDigits: maximumFractionDigits,
    maximumFractionDigits,
  }
  return Number(value).toLocaleString('en', options)
}
