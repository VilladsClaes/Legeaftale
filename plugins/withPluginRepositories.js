// Declares plugin repositories in android/settings.gradle during `expo prebuild`.
// Without them Gradle only uses the Plugin Portal, which no longer serves some of the
// Maven Central dependencies of the React Native settings plugin (javapoet, jsr305, guava).
const { withSettingsGradle } = require('expo/config-plugins');

const MARKER = '// legeaftale-plugin-repositories';

const REPOSITORIES = `pluginManagement {
  ${MARKER}
  repositories {
    google()
    mavenCentral()
    gradlePluginPortal()
  }
`;

module.exports = function withPluginRepositories(config) {
  return withSettingsGradle(config, (cfg) => {
    const gradle = cfg.modResults.contents;
    if (gradle.includes(MARKER)) return cfg;
    if (!/^pluginManagement\s*\{\n/m.test(gradle)) {
      throw new Error('withPluginRepositories: could not patch android/settings.gradle');
    }
    cfg.modResults.contents = gradle.replace(/^pluginManagement\s*\{\n/m, REPOSITORIES);
    return cfg;
  });
};
