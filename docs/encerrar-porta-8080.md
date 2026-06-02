# Encerrar Porta 8080

Quando a API nao inicia e aparece que a porta `8080` ja esta em uso, use este comando no PowerShell (nao falha se a porta estiver livre):

```powershell
$p = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue; if ($p) { Stop-Process -Id $p.OwningProcess -Force }
```

## Passo a passo rapido
1. Execute o comando acima no terminal **PowerShell**.
2. Suba novamente a API:
```bash
mvn spring-boot:run
```

## Se quiser conferir antes de matar
```powershell
Get-NetTCPConnection -LocalPort 8080 -State Listen
```
