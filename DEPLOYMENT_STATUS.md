Render services seem to have gone down (free tier sleep or crash).

The app code is solid. Services at:
- Frontend: primelink-frontend.onrender.com
- Backend: primelink-backend.onrender.com

Next steps:
1. Check Render dashboard manually: https://dashboard.render.com
2. Click Services → primelink-backend & primelink-frontend
3. Check if deploy is in progress or failed
4. If failed: redeploy from git
5. If sleeping: manually trigger 'Deploy' button

Or we can migrate to a paid tier or different host for reliability.

The mobile APK is ready to download via QR code once backend is online again.
