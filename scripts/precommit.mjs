import { spawnSync } from 'node:child_process'

const pnpmPath = process.env.npm_execpath

if (!pnpmPath) {
  console.error('Run this workflow with: pnpm precommit')
  process.exit(1)
}

const steps = [
  { name: 'Build and type-check', args: ['build'] },
  { name: 'Unit tests', args: ['test:unit', '--run', '--passWithNoTests'] },
  {
    name: 'Lint and format staged files',
    args: ['exec', 'lint-staged', '--concurrent', 'false', '--verbose'],
  },
]

for (const [index, step] of steps.entries()) {
  const command = `pnpm ${step.args.join(' ')}`
  console.log(`\n[${index + 1}/${steps.length}] ${step.name}`)
  console.log(`> ${command}\n`)

  const result = spawnSync(process.execPath, [pnpmPath, ...step.args], {
    stdio: 'inherit',
    windowsHide: true,
  })

  if (result.status !== 0) {
    if (result.error) {
      console.error(`Could not start the step: ${result.error.message}`)
    } else if (result.signal) {
      console.error(`The step was stopped by signal: ${result.signal}`)
    }

    console.error(`\nPrecommit failed: ${step.name}.`)
    const remaining = steps.slice(index + 1).map((nextStep) => nextStep.name)
    if (remaining.length > 0) {
      console.error(`Not run: ${remaining.join('; ')}.`)
    }
    console.error(`Retry: ${command}`)
    console.error('Resolve the issue, stage any fixes, and try committing again.')
    process.exitCode = result.status ?? 1
    break
  }

  console.log(`\nPassed: ${step.name}.`)
}

if (!process.exitCode) {
  console.log('\nPrecommit completed successfully.')
}
