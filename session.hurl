# Classic - should register without restrictions
POST {{host}}/client
{
  "name": "Alice Classic",
  "country": "USA",
  "monthlyIncome": 100,
  "viseClub": false,
  "cardType": "Classic"
}
HTTP 201
[Captures]
classic_id: jsonpath "$['clientId']"
[Asserts]
jsonpath "$.status" == "Registered"
jsonpath "$.cardType" == "Classic"

# Gold - valid case (income >= 500)
POST {{host}}/client
{
  "name": "Bob Gold",
  "country": "USA",
  "monthlyIncome": 600,
  "viseClub": false,
  "cardType": "Gold"
}
HTTP 201
[Captures]
gold_id: jsonpath "$['clientId']"
[Asserts]
jsonpath "$.status" == "Registered"
jsonpath "$.cardType" == "Gold"

# Platinum - valid case (income >= 1000, Vise CLUB)
POST {{host}}/client
{
  "name": "Bob Gold",
  "country": "USA",
  "monthlyIncome": 1200,
  "viseClub": true,
  "cardType": "Platinum"
}
HTTP 201
[Captures]
platinum_id: jsonpath "$['clientId']"
[Asserts]
jsonpath "$.status" == "Registered"
jsonpath "$.cardType" == "Platinum"

# Black - valid case (income >= 2000, Vise CLUB, USA country)
POST {{host}}/client
{
  "name": "Bob Gold",
  "country": "USA",
  "monthlyIncome": 2100,
  "viseClub": true,
  "cardType": "Black"
}
HTTP 201
[Captures]
black_id: jsonpath "$['clientId']"
[Asserts]
jsonpath "$.status" == "Registered"
jsonpath "$.cardType" == "Black"

# White - valid case (income >= 2000, Vise CLUB, USA country)
POST {{host}}/client
{
  "name": "Bob Gold",
  "country": "USA",
  "monthlyIncome": 2100,
  "viseClub": true,
  "cardType": "White"
}
HTTP 201
[Captures]
white_id: jsonpath "$['clientId']"
[Asserts]
jsonpath "$.status" == "Registered"
jsonpath "$.cardType" == "White"
