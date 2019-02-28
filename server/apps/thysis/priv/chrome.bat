@echo off
Taskkill /IM chromedriver.exe /F >nul 2>&1

start "" /b /low chromedriver --silent >nul 2>&1
