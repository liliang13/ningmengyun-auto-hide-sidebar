$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "F:\web_projects\61api\ningmengyun-auto-hide-sidebar\watch-and-push.ps1"'
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -StartWhenAvailable -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit 0
Register-ScheduledTask -TaskName 'NingmengyunUserscriptAutoPush' -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
Start-ScheduledTask -TaskName 'NingmengyunUserscriptAutoPush'
Start-Sleep -Milliseconds 1500
(Get-ScheduledTask -TaskName 'NingmengyunUserscriptAutoPush').State
