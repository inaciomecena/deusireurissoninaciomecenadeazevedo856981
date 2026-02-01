@echo off
setlocal

echo ===================================================
echo      INICIANDO SISTEMA SOUNDWAVE (SELETIVO)
echo ===================================================
echo.

:: Garante que o script rode no diretorio correto
cd /d "%~dp0"

echo [1/3] Parando containers antigos e limpando volumes nao utilizados...
docker-compose down --remove-orphans

echo.
echo [2/3] Construindo imagens e iniciando containers (Isso pode demorar um pouco)...
docker-compose up --build -d

echo.
echo [3/3] Verificando status dos servicos...
docker-compose ps

echo.
echo ===================================================
echo                SISTEMA OPERACIONAL
echo ===================================================
echo.
echo  - Frontend:   http://localhost:5173
echo  - API:        http://localhost:8080
echo  - Grafana:    http://localhost:3000
echo  - Prometheus: http://localhost:9090
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
