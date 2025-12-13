# Troubleshooting

## MongoDB connection refused on localhost:27017
**Symptom:** `ECONNREFUSED 127.0.0.1:27017` when running `npm run dev` or connecting via Compass.

**Resolution steps (Windows):**
1) Check MongoDB service and start it if installed:
```powershell
Get-Service | Where-Object { $_.Name -like '*Mongo*' }
Start-Service -Name "MongoDB"   # use the exact service name shown above
```
2) If MongoDB isn’t installed as a service, use Docker:
```powershell
docker run -d --name mongo-sweet -p 27017:27017 mongo:6.0
```
3) Keep `server/.env` pointing to the local instance:
```
MONGO_URI=mongodb://localhost:27017/sweet-shop
```
4) Restart backend: `cd server; npm run dev`

After the service/container is running, Compass and the app should connect using `mongodb://localhost:27017/sweet-shop`.
