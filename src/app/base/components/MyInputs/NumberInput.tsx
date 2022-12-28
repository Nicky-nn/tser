export const numberWithCommas = (x: number | undefined, { userTyping, input }: any) => {
  if (userTyping) {
    return input
  }
  const options = {
    minimumFractionDigits: 2,
  }
  return Number(x).toLocaleString('en', options)
}
