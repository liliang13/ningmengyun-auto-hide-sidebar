$ErrorActionPreference = 'Continue'

$repo = $PSScriptRoot
$scriptName = 'ningmengyun-auto-hide-sidebar.user.js'
$scriptPath = Join-Path $repo $scriptName
$logPath = Join-Path $repo 'watcher.log'
$utf8 = New-Object System.Text.UTF8Encoding($false)

Set-Location $repo

function Write-Log {
    param([string]$Message)

    $line = '{0} {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message
    Add-Content -LiteralPath $logPath -Value $line -Encoding UTF8
}

function Get-ScriptHash {
    return (Get-FileHash -LiteralPath $scriptPath -Algorithm SHA256).Hash
}

function Invoke-Git {
    param([string[]]$Arguments)

    $output = & git @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw ($output -join [Environment]::NewLine)
    }
}

$lastHash = Get-ScriptHash
Write-Log "Watcher started: $scriptPath"

while ($true) {
    Start-Sleep -Seconds 1

    try {
        if (-not (Test-Path -LiteralPath $scriptPath)) {
            continue
        }

        if ((Get-ScriptHash) -eq $lastHash) {
            continue
        }

        Start-Sleep -Seconds 3
        if ((Get-ScriptHash) -eq $lastHash) {
            continue
        }

        $lastHash = Get-ScriptHash
        $content = [System.IO.File]::ReadAllText($scriptPath)
        $versionMatch = [regex]::Match(
            $content,
            '(?m)^// @version[ \t]+(\d+)\.(\d+)\.(\d+)[ \t]*\r?$'
        )

        if (-not $versionMatch.Success) {
            Write-Log 'No valid // @version x.y.z line found; commit skipped.'
            continue
        }

        $nodeOutput = & node --check $scriptPath 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Log ('JavaScript syntax check failed: ' + ($nodeOutput -join [Environment]::NewLine))
            continue
        }

        $major = [int]$versionMatch.Groups[1].Value
        $minor = [int]$versionMatch.Groups[2].Value
        $patch = [int]$versionMatch.Groups[3].Value + 1
        $newVersion = "$major.$minor.$patch"
        $newVersionLine = "// @version      $newVersion"
        if ($versionMatch.Value.EndsWith("`r")) {
            $newVersionLine += "`r"
        }

        $updated = $content.Remove($versionMatch.Index, $versionMatch.Length)
        $updated = $updated.Insert($versionMatch.Index, $newVersionLine)
        [System.IO.File]::WriteAllText($scriptPath, $updated, $utf8)
        $lastHash = Get-ScriptHash

        Invoke-Git -Arguments @('add', '--', $scriptName)
        Invoke-Git -Arguments @('commit', '-m', "Update userscript to $newVersion")
        Invoke-Git -Arguments @('push', 'origin', 'main')

        Write-Log "Committed and pushed version $newVersion."
    }
    catch {
        Write-Log ('Processing failed: ' + $_.Exception.Message)
        try {
            $lastHash = Get-ScriptHash
        }
        catch {
        }
    }
}
