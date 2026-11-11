import { ESLint } from 'eslint'

const MAX_FIX_RUNS = 10
const eslint = new ESLint({ fix: true })
const formatter = await eslint.loadFormatter('stylish')

// Attribute sorting can require more than ESLint's ten internal autofix passes.
for (let run = 1; run <= MAX_FIX_RUNS; run += 1) {
  const results = await eslint.lintFiles(['src/'])
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
    console.error(`ESLint could not apply all fixes after ${run} runs.`)
  }

  process.exitCode = hasRemainingFixes || results.some((result) => result.errorCount > 0) ? 1 : 0
  break
}
