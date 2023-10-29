import { Platform, View, Alert } from "react-native";
import MyText from "../components/MyText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "../constants/theme";
import Section from "../components/inputs/Section";
import { usePreferences } from "../stores/preferences";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigation } from "../stacks/RootStack";
import i18n from "../lib/locales";
import InputRowButton from "../components/inputs/InputRowButton";
import Divider from "../components/Divider";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import * as Application from "expo-application";
import * as Sentry from "sentry-expo";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";

const Settings = () => {
  const { set: setPreferences } = usePreferences();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RootStackNavigation>();

  const resetToOnboarding = () => {
    setPreferences({ onboardingComplete: false });
  };

  useEffect(() => {
    const updateNotificationsStatus = async () => {
      const settings = await Notifications.getPermissionsAsync();
      if (!settings.granted) {
        return;
      }
      setNotificationsEnabled(true);
    };
    updateNotificationsStatus();
  }, []);

  const askToTakeToSettings = () => {
    Alert.alert(
      i18n.t("notificationsDisabled"),
      i18n.t("notificationsDisabled_description"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("yes"),
          style: "default",
          onPress: () => Linking.openSettings(),
        },
      ]
    );
  };

  const fetchUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          i18n.t("update"),
          i18n.t("update_description", [
            {
              text: i18n.t("cancel"),
              style: "cancel",
            },
            {
              text: i18n.t("yes"),
              style: "default",
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              },
            },
          ])
        );
        return;
      }
      Alert.alert(i18n.t("noUpdateAvailable"));
    } catch (error) {
      Alert.alert(
        `${i18n.t("updateViaThe")} ${
          Platform.OS === "android" ? "Play Store" : "App Store"
        }`,
        `${i18n.t("update_error")} ${error}`
      );
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
        flexGrow: 1,
        justifyContent: "space-between",
      }}
    >
      <View style={{ gap: 25 }}>
        <MyText
          style={{
            marginLeft: 20,
            marginTop: 20,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {i18n.t("settings")}
        </MyText>
        <View style={{ gap: 3 }}>
          <MyText
            style={{
              marginLeft: 20,
              fontWeight: "600",
              fontSize: 12,
              color: theme.colors.textAlt,
              textTransform: "uppercase",
            }}
          >
            {i18n.t("app")}
          </MyText>
          <Section>
            <InputRowButton
              leftIcon={notificationsEnabled ? "bell" : "bell-slash"}
              label={
                notificationsEnabled
                  ? i18n.t("pushNotificationsEnabled")
                  : i18n.t("pushNotificationsDisabled")
              }
              onPress={notificationsEnabled ? undefined : askToTakeToSettings}
            >
              {!notificationsEnabled && (
                <FontAwesome
                  name="chevron-right"
                  style={{ color: theme.colors.textAlt }}
                />
              )}
            </InputRowButton>
            <InputRowButton
              leftIcon="hourglass-half"
              label={i18n.t("viewHours")}
              onPress={() => navigation.navigate("Time Reports")}
            >
              <FontAwesome
                name="chevron-right"
                style={{ color: theme.colors.textAlt }}
              />
            </InputRowButton>
            <InputRowButton
              leftIcon="undo"
              label={i18n.t("recoverContacts")}
              onPress={() => navigation.navigate("Recover Contacts")}
            >
              <FontAwesome
                name="chevron-right"
                style={{ color: theme.colors.textAlt }}
              />
            </InputRowButton>
            <InputRowButton
              leftIcon="tools"
              label={i18n.t("restartOnboarding")}
              onPress={resetToOnboarding}
            >
              <FontAwesome
                style={{ color: theme.colors.textAlt }}
                name="chevron-right"
              />
            </InputRowButton>
            <InputRowButton
              leftIcon="download"
              label={i18n.t("checkForUpdate")}
              onPress={fetchUpdate}
              lastInSection
            >
              <FontAwesome
                style={{ color: theme.colors.textAlt }}
                name="chevron-right"
              />
            </InputRowButton>
          </Section>
        </View>
        <Divider borderStyle="dashed" />
        <View style={{ gap: 3 }}>
          <MyText
            style={{
              marginLeft: 20,
              fontWeight: "600",
              fontSize: 12,
              color: theme.colors.textAlt,
              textTransform: "uppercase",
            }}
          >
            {i18n.t("misc")}
          </MyText>
          <Section>
            <InputRowButton
              leftIcon="heart"
              label={
                Platform.OS === "android"
                  ? i18n.t("rateJWTimeOnPlayStore")
                  : i18n.t("rateJWTimeOnAppStore")
              }
              onPress={() => {
                const itunesItemId = 6469723047;
                try {
                  Platform.OS === "android"
                    ? Linking.openURL(
                        `market://details?id=${Application.applicationId}&showAllReviews=true`
                      )
                    : Linking.openURL(
                        `https://apps.apple.com/app/apple-store/id${itunesItemId}?action=write-review`
                      );
                } catch (error) {
                  Sentry.Native.captureException(error);
                }
              }}
            >
              <FontAwesome
                name="chevron-right"
                style={{ color: theme.colors.textAlt }}
              />
            </InputRowButton>
            <InputRowButton
              lastInSection
              leftIcon="bug"
              label={i18n.t("bugReport")}
              onPress={() => {
                const email = "levi.wilkerson@proton.me";
                const subjectText = "Bug Report";
                const bodyText = `App Version: ${Constants.expoConfig?.version}, Device: ${Device.modelName}, OS: ${Device.osVersion}. Please describe your issue in detail: --------------`;
                const subject = encodeURIComponent(subjectText);
                const body = encodeURIComponent(bodyText);
                Linking.openURL(
                  `mailto:${email}?subject=${subject}&body=${body}`
                );
              }}
            >
              <FontAwesome
                name="chevron-right"
                style={{ color: theme.colors.textAlt }}
              />
            </InputRowButton>
            {/* <InputRowButton
              leftIcon="gift"
              label={i18n.t("buyMeACoffee")}
              onPress={() =>
                Linking.openURL("https://www.buymeacoffee.com/leviwilkerson")
              }
              lastInSection
            >
              <FontAwesome
                style={{ color: theme.colors.textAlt }}
                name="chevron-right"
              />
            </InputRowButton> */}
          </Section>
        </View>
      </View>
      <View>
        <MyText
          style={{
            textAlign: "center",
            color: theme.colors.textAlt,
            fontWeight: "600",
          }}
        >
          {Constants.expoConfig?.version
            ? `v${Constants.expoConfig?.version}`
            : i18n.t("versionUnknown")}
        </MyText>
      </View>
    </View>
  );
};

export default Settings;
