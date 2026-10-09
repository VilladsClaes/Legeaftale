# Legeaftale

En lille Expo/React Native-app til at planlægge op til 5 leg-aftaler om dagen med børnene.
Alt gemmes lokalt på telefonen (AsyncStorage) — ingen login, ingen server, ingen dataindsamling.

## Udvikling

```bash
pnpm install
pnpm start          # Expo dev-server (Expo Go / web)
pnpm typecheck
pnpm lint
```

## Byg Android-app

Kræver JDK 17+ og Android SDK (platform 36, build-tools 36, NDK 27.1) med `ANDROID_HOME` sat.

```bash
pnpm build:apk   # -> android/app/build/outputs/apk/release/app-release.apk   (til direkte installation)
pnpm build:aab   # -> android/app/build/outputs/bundle/release/app-release.aab (til Google Play)
```

`android/` genereres af `expo prebuild` og er ikke i git.

### Signering

Release-builds signeres med en upload-nøgle, hvis disse variabler er sat (som env-variabler
eller i `~/.gradle/gradle.properties`); ellers bruges debug-nøglen (kun til test):

```
LEGEAFTALE_UPLOAD_STORE_FILE=/sti/til/upload.jks
LEGEAFTALE_UPLOAD_STORE_PASSWORD=...
LEGEAFTALE_UPLOAD_KEY_ALIAS=upload
LEGEAFTALE_UPLOAD_KEY_PASSWORD=...
```

Opret en upload-nøgle (gem den og kodeordene sikkert — **aldrig i git**):

```bash
keytool -genkeypair -v -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload -keystore upload.jks
```

### GitHub Actions

`.github/workflows/android.yml` bygger APK + AAB ved push til `main`, tags `v*` eller manuelt
(Actions → Android build → Run workflow). Filerne ligger som artifact på kørslen.
Tilføj disse repository-secrets for at signere med upload-nøglen:
`ANDROID_KEYSTORE_BASE64` (`base64 -w0 upload.jks`), `ANDROID_KEYSTORE_PASSWORD`,
`ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.

### Ny version

Hæv `expo.version` og `expo.android.versionCode` i `app.json` før hver upload til Google Play.
