@echo off
title Plataforma Fisica y Quimica 2 Parcial - Servidor Local Anti-Error 153
echo ============================================================================
echo   INICIANDO PLATAFORMA INTERACTIVA FISICA Y QUIMICA 2 PARCIAL
echo   (Modo Servidor Local HTTP para evitar el Error 153 de YouTube en Chrome)
echo ============================================================================
where python >nul 2>nul
if %errorlevel%==0 (
    start "" "http://localhost:8765/index.html"
    python -m http.server 8765
    goto :eof
)
where py >nul 2>nul
if %errorlevel%==0 (
    start "" "http://localhost:8765/index.html"
    py -m http.server 8765
    goto :eof
)
echo Abriendo index.html directamente en el navegador...
start "" "index.html"
