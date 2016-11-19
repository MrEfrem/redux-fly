const getRandomInt = (min, max) => (
  Math.floor(Math.random() * (max - min)) + min
)

export const fetchCounter = () =>
  new Promise(resolve => {
    // Rather than immediately returning, we delay our code with a timeout to simulate asynchronous behavior
    setTimeout(() => {
      resolve(getRandomInt(1, 100))
    }, 500)
  })
