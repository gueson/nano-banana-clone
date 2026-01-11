param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Args
)

$pnpmHost = Join-Path $env:APPDATA 'npm\pnpm.cmd'

if (Test-Path $pnpmHost) {
  & $pnpmHost @Args
  exit $LASTEXITCODE
}

& pnpm @Args
exit $LASTEXITCODE

