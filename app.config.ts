import { ExpoConfig, ConfigContext } from 'expo/config'
/** Passed in from `env` property in profile `./eas.json` to eas build */
const IS_DEV = process.env.APP_VARIANT === 'development'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? 'JW Time Dev' : 'JW Time',
  developmentClient: {},
  slug: 'jw-time',
  version: '1.22.1',
  owner: 'levi_frosty',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './src/assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#4BD27C',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV
      ? 'com.leviwilkerson.jwtimedev'
      : 'com.leviwilkerson.jwtime',
    infoPlist: {
      RCTAsyncStorageExcludeFromBackup: false,
    },
    appStoreUrl: 'https://apps.apple.com/us/app/jw-time/id6469723047',
  },
  android: {
    allowBackup: true,
    adaptiveIcon: {
      foregroundImage: './src/assets/adaptive-icon.png',
      monochromeImage: './src/assets/adaptive-icon-monochrome.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.leviwilkerson.jwtime',
    playStoreUrl:
      'https://play.google.com/store/apps/details?id=com.leviwilkerson.jwtime',
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_ANDROID_SDK_API_KEY,
      },
    },
  },
  extra: {
    eas: {
      projectId: 'a67257dc-2fb8-4942-97f2-e9364b80d318',
    },
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: 'https://u.expo.dev/a67257dc-2fb8-4942-97f2-e9364b80d318',
  },
  plugins: [
    'sentry-expo',
    'expo-localization',
    ['expo-updates', { username: 'levi_frosty' }],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          '$(PRODUCT_NAME) will use your location to display where you are on the map, useful for finding nearby contacts.',
      },
    ],
    [
      'expo-document-picker',
      {
        iCloudContainerEnvironment: IS_DEV ? 'Development' : 'Production',
      },
    ],
  ],
  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: 'levi-wilkerson',
          project: 'jw-time',
        },
      },
    ],
  },
})
