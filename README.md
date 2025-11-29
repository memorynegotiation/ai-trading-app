AI Trading App — Expo + FastAPI demo

How to use:
- Mobile: Expo app (open with expo-cli / EAS). For cloud build use Expo EAS.
- Backend: FastAPI server in `server/` (run with `uvicorn server.main:app --reload --port 8000`).

To build APK (no desktop required):
1. Import this repo on expo.dev (Connect GitHub).
2. On expo.dev open project and click Build -> Android -> pick 'preview' (APK).
3. EAS cloud produces an APK download URL when build finishes.

This is a demo toy project. Replace indicators & model with production feeds and add auth/KYC/order-execution before using with real funds.
