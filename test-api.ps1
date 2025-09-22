# Script de Pruebas para VISE Payment API

Write-Host "==================================="
Write-Host "PRUEBAS DE LA API VISE PAYMENT"
Write-Host "==================================="

# Función auxiliar para hacer requests
function Test-APIEndpoint {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [string]$Body = $null,
        [string]$Description
    )
    
    Write-Host "`n--- $Description ---"
    Write-Host "URL: $Method $Url"
    
    try {
        if ($Body) {
            Write-Host "Body: $Body"
            $response = Invoke-RestMethod -Uri $Url -Method $Method -ContentType 'application/json' -Body $Body
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method
        }
        
        Write-Host "✅ ÉXITO:"
        $response | ConvertTo-Json -Depth 3
        return $response
    }
    catch {
        Write-Host "❌ ERROR: $($_.Exception.Message)"
        return $null
    }
}

# 1. Verificar estado de la API
Test-APIEndpoint -Url "http://localhost:3000/health" -Description "Verificar estado de la API"

# 2. Registrar cliente Classic (sin restricciones)
$client1 = @{
    name = "Ana López"
    country = "Colombia"
    monthlyIncome = 300
    viseClub = $false
    cardType = "Classic"
} | ConvertTo-Json

Test-APIEndpoint -Url "http://localhost:3000/client" -Method "POST" -Body $client1 -Description "Registrar cliente Classic"

# 3. Registrar cliente Gold
$client2 = @{
    name = "Carlos Mendoza"
    country = "Argentina"
    monthlyIncome = 750
    viseClub = $false
    cardType = "Gold"
} | ConvertTo-Json

Test-APIEndpoint -Url "http://localhost:3000/client" -Method "POST" -Body $client2 -Description "Registrar cliente Gold"

# 4. Registrar cliente Platinum
$client3 = @{
    name = "Laura Silva"
    country = "Brasil"
    monthlyIncome = 1500
    viseClub = $true
    cardType = "Platinum"
} | ConvertTo-Json

Test-APIEndpoint -Url "http://localhost:3000/client" -Method "POST" -Body $client3 -Description "Registrar cliente Platinum"

# 5. Intentar registrar cliente con restricciones no cumplidas
$client4 = @{
    name = "Pedro González"
    country = "España"
    monthlyIncome = 400
    viseClub = $false
    cardType = "Gold"
} | ConvertTo-Json

Test-APIEndpoint -Url "http://localhost:3000/client" -Method "POST" -Body $client4 -Description "Intentar cliente Gold con ingreso insuficiente (debe fallar)"

# 6. Procesar compra Classic (sin beneficios)
$purchase1 = @{
    clientId = 1
    amount = 100
    currency = "USD"
    purchaseDate = "2025-09-22T10:00:00Z"
    purchaseCountry = "Colombia"
} | ConvertTo-Json

Test-APIEndpoint -Url "http://localhost:3000/purchase" -Method "POST" -Body $purchase1 -Description "Compra Classic (sin beneficios)"

# 7. Procesar compra Gold con descuento (lunes)
$purchase2 = @{
    clientId = 2
    amount = 120
    currency = "USD"
    purchaseDate = "2025-09-22T10:00:00Z"  # Lunes
    purchaseCountry = "Argentina"
} | ConvertTo-Json

Test-APIEndpoint -Url "http://localhost:3000/purchase" -Method "POST" -Body $purchase2 -Description "Compra Gold con descuento 15% (lunes, >100 USD)"

# 8. Procesar compra Platinum con descuento sábado
$purchase3 = @{
    clientId = 3
    amount = 250
    currency = "USD"
    purchaseDate = "2025-09-20T14:30:00Z"  # Sábado
    purchaseCountry = "França"
} | ConvertTo-Json

Test-APIEndpoint -Url "http://localhost:3000/purchase" -Method "POST" -Body $purchase3 -Description "Compra Platinum sábado + internacional (30% + 5%)"

# 9. Ver todos los clientes registrados
Test-APIEndpoint -Url "http://localhost:3000/client" -Description "Ver todos los clientes"

# 10. Ver todas las compras procesadas
Test-APIEndpoint -Url "http://localhost:3000/purchase" -Description "Ver todas las compras"

Write-Host "`n==================================="
Write-Host "PRUEBAS COMPLETADAS"
Write-Host "==================================="