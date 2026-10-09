// Adds a "release" signing config to android/app/build.gradle during `expo prebuild`.
// The keystore is read from Gradle properties or environment variables:
//   LEGEAFTALE_UPLOAD_STORE_FILE, LEGEAFTALE_UPLOAD_STORE_PASSWORD,
//   LEGEAFTALE_UPLOAD_KEY_ALIAS, LEGEAFTALE_UPLOAD_KEY_PASSWORD
// If they are missing, release builds fall back to the debug key (fine for testing,
// not accepted by Google Play).
const { withAppBuildGradle } = require('expo/config-plugins');

const MARKER = '// legeaftale-release-signing';

const SIGNING_CONFIG = `
        release {
            ${MARKER}
            def prop = { name -> project.findProperty(name) ?: System.getenv(name) }
            if (prop('LEGEAFTALE_UPLOAD_STORE_FILE')) {
                storeFile file(prop('LEGEAFTALE_UPLOAD_STORE_FILE'))
                storePassword prop('LEGEAFTALE_UPLOAD_STORE_PASSWORD')
                keyAlias prop('LEGEAFTALE_UPLOAD_KEY_ALIAS')
                keyPassword prop('LEGEAFTALE_UPLOAD_KEY_PASSWORD')
            } else {
                storeFile file('debug.keystore')
                storePassword 'android'
                keyAlias 'androiddebugkey'
                keyPassword 'android'
            }
        }`;

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    let gradle = cfg.modResults.contents;
    if (gradle.includes(MARKER)) return cfg;

    // Add the release config next to the generated debug config.
    gradle = gradle.replace(
      /signingConfigs\s*\{\s*\n(\s*)debug\s*\{/,
      (match, indent) => match.replace(/signingConfigs\s*\{/, `signingConfigs {${SIGNING_CONFIG}`),
    );

    // Point the release build type at it (template uses the debug config by default).
    gradle = gradle.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/,
      '$1signingConfig signingConfigs.release',
    );

    if (!gradle.includes(MARKER) || !gradle.includes('signingConfig signingConfigs.release')) {
      throw new Error('withReleaseSigning: could not patch android/app/build.gradle');
    }
    cfg.modResults.contents = gradle;
    return cfg;
  });
};
