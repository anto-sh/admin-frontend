import { ESLint } from 'eslint'

const MAX_FIX_RUNS = 10
const files = process.argv.length > 2 ? process.argv.slice(2) : ['src/']
const eslint = new ESLint({ fix: true })
const formatter = await eslint.loadFormatter('stylish')

// Attribute sorting can require more than ESLint's ten internal autofix passes.
for (let run = 1; run <= MAX_FIX_RUNS; run += 1) {
  const results = await eslint.lintFiles(files)
  await ESLint.outputFixes(results)

  const hasRemainingFixes = results.some(
    (result) => result.fixableErrorCount > 0 || result.fixableWarningCount > 0,
  )
  const hasChanges = results.some((result) => result.output !== undefined)

  if (hasRemainingFixes && hasChanges && run < MAX_FIX_RUNS) {
    continue
  }

  const report = formatter.format(results)
  if (report) {
    process.stdout.write(report)
  }
  if (hasRemainingFixes) {
    console.warn(`ESLint could not apply all fixes after ${run} runs.`)
  }

  process.exitCode = results.some((result) => result.errorCount > 0) ? 1 : 0
  break
}
