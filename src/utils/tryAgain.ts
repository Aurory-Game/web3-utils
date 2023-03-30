import * as readline from 'readline'

export async function askTryAgain(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin, //or fileStream 
    output: process.stdout
  })
  const answer = await new Promise(resolve => {
    const handleAnswer = (answer: string) => {
      if (answer === 'y' || answer === 'n') {
        rl.close()
        resolve(answer)
      }
      else rl.question(`Do you want to try again? (y/n)\n`, handleAnswer)
    }
    rl.question(`Do you want to try again? (y/n)\n`, handleAnswer)
  })
  return answer === 'y'
}