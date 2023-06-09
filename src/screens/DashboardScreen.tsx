import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import {
  Button,
  Divider,
  Icon,
  Input,
  Layout,
  Text,
  useStyleSheet,
} from "@ui-kitten/components";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import * as Device from "expo-device";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ImageProps,
  Keyboard,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CallCard from "../components/CallCard";
import { ExportIcon } from "../components/Icons";
import MonthReport, { parseForMonthReport } from "../components/MonthReport";
import ScreenTitle from "../components/ScreenTitle";
import WeeklyActivityTicks from "../components/WeeklyActivityTicks";
import appTheme from "../lib/theme";
import { i18n } from "../lib/translations";
import useTimer from "../lib/userTimer";
import { HomeStackParamList } from "../stacks/ParamLists";
import useCallsStore from "../stores/CallStore";
import useServiceRecordStore, {
  MonthReportData,
} from "../stores/ServiceRecord";
import useSettingStore from "../stores/SettingsStore";
import useVisitsStore from "../stores/VisitStore";

type HomeProps = NativeStackScreenProps<HomeStackParamList, "Dashboard">;

export type Sheet = {
  isOpen: boolean;
  hasSaved: boolean;
};

const MagnifyIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="magnify" />;

const PlusIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="plus" />;
const PlayIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="play" />;
const PauseIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="pause" />;
const StopIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="stop" />;

const DashboardScreen = ({ navigation }: HomeProps) => {
  const { play, pause, reset, formattedTime, hasStarted, isRunning } =
    useTimer();
  const [debug, setDebug] = useState(false);
  const [query, setQuery] = useState("");
  const { resetAllSettings } = useSettingStore();
  const { calls, deleteAllCalls } = useCallsStore();
  const { records, deleteAllRecords } = useServiceRecordStore();
  const { visits, deleteAllVisits } = useVisitsStore();
  const insets = useSafeAreaInsets();

  const [, setExpoPushToken] = useState<string | void>();
  const [, setNotification] = useState<Notifications.Notification | boolean>(
    false,
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const monthReport = useMemo((): MonthReportData => {
    const month = moment().month();
    return parseForMonthReport({
      calls,
      records,
      visits,
      month,
    });
  }, [records, calls, visits]);

  const queriedCalls = useMemo(() => {
    return calls.filter(c =>
      c.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    );
  }, [calls, query]);

  const themeStyles = StyleSheet.create({
    wrapper: {
      flex: 1,
      position: "relative",
      paddingTop: insets.top + 20,
      paddingRight: appTheme.contentPaddingLeftRight,
      paddingLeft: appTheme.contentPaddingLeftRight,
    },
    content: {
      flex: 1,
      gap: 20,
    },
    fab: {
      position: "absolute",
      paddingBottom: 90,
      paddingRight: 10,
    },
  });

  const styles = useStyleSheet(themeStyles);

  const isInService = useMemo(
    () => hasStarted || isRunning,
    [hasStarted, isRunning],
  ); // would otherwise run each on clock tick.

  async function schedulePushNotification() {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: "Here is the notification body",
        data: { data: "goes here" },
        subtitle: "Subtitle here!",
      },
      trigger: { seconds: 1, repeats: true },
    });
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (!Device.isDevice) {
      return alert("Must use physical device for Push Notifications");
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <Layout style={styles.wrapper}>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <Text>Something</Text>
          <Button onPress={schedulePushNotification}>Get Notification</Button>
          <View>
            <View style={{ flexDirection: "row" }}>
              {isInService && (
                <View
                  style={{
                    flexDirection: "row",
                    flexShrink: 1,
                    gap: 5,
                  }}>
                  {isRunning ? (
                    <Button accessoryLeft={PauseIcon} onPress={pause} />
                  ) : (
                    <Button accessoryLeft={PlayIcon} onPress={play} />
                  )}
                  <Button
                    appearance="ghost"
                    accessoryLeft={StopIcon}
                    onPress={reset}
                  />
                </View>
              )}
              <ScreenTitle
                title={isInService ? formattedTime : i18n.t("dashboard")}
                icon="cog"
                status={isInService ? "success" : "basic"}
                onIconLongPress={() => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Warning,
                  );
                  setDebug(!debug);
                }}
                onIconPress={() => {
                  navigation.navigate("Settings");
                }}
              />
            </View>
            <View>
              {isInService ? (
                <React.Fragment>
                  <Text>{i18n.t("youAreInService!")}</Text>
                  <Text appearance="hint" category="c1">
                    {i18n.t("stopTimeWillAutomaticallyAddToReport")}
                  </Text>
                </React.Fragment>
              ) : (
                <WeeklyActivityTicks />
              )}
            </View>
          </View>
          <View style={{ gap: 10 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
              }}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation.navigate("AnnualReport", {
                    year: moment().year(),
                  });
                }}>
                <Text category="h4">{i18n.t("monthlyTotals")}</Text>
              </Pressable>
              <Button
                appearance="ghost"
                size="small"
                accessoryLeft={ExportIcon}
                onPress={async () =>
                  await Share.share({
                    title: monthReport.share?.title,
                    message: monthReport.share?.message || "",
                  })
                }
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.navigate("AnnualReport", { year: moment().year() });
              }}>
              <MonthReport report={monthReport} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={{ marginBottom: 5 }} category="h4">
              Calls
            </Text>
            <Layout level="2" style={{ gap: 10, flex: 1 }}>
              <Input
                value={query}
                clearButtonMode="while-editing"
                onChangeText={text => setQuery(text)}
                placeholder="Search for a call..."
                accessoryRight={MagnifyIcon}
              />
              <FlashList
                data={queriedCalls || calls}
                ListEmptyComponent={
                  query ? (
                    <Text
                      style={{
                        marginHorizontal: 5,
                      }}
                      appearance="hint">
                      <React.Fragment>
                        {i18n.t("noResultsForQuery")}"
                        <Text category="c2">{query}</Text>
                        "...
                      </React.Fragment>
                    </Text>
                  ) : undefined
                }
                ItemSeparatorComponent={props => (
                  <Divider
                    style={{
                      marginVertical: 5,
                    }}
                    {...props}
                  />
                )}
                estimatedItemSize={60}
                renderItem={({ item }) => <CallCard call={item} />}
                keyExtractor={item => item.id}
              />
            </Layout>

            {/* TODO: Filter options */}
            {/* Filter options: 
            - Upcoming Visit
            - Hunger Level
            - A -> Z
            -Proximity
            -Longest since visited 
        */}
          </View>
        </View>
        {debug && (
          <Layout
            level="2"
            style={{
              paddingVertical: 10,
              gap: 5,
              borderRadius: appTheme.borderRadius,
            }}
            id="debug">
            <Text category="s1">Debug:</Text>
            <Button
              appearance="outline"
              status="success"
              onPress={() => (isRunning ? pause() : play())}>
              {isRunning ? "Pause Timer" : "Start Timer"}
            </Button>
            <Button appearance="outline" status="warning" onPress={reset}>
              Stop timer
            </Button>

            <Button
              appearance="outline"
              status="success"
              onPress={() => navigation.navigate("ServiceRecordForm")}>
              Create Service Record
            </Button>
            <Button
              onLongPress={resetAllSettings}
              status="danger"
              appearance="outline">
              Reset all settings
            </Button>
            <Button
              status="danger"
              appearance="outline"
              onLongPress={deleteAllRecords}>
              Delete All Reports
            </Button>
            <Button
              status="danger"
              appearance="outline"
              onLongPress={deleteAllVisits}>
              Delete All Visits
            </Button>
            <Button
              status="danger"
              appearance="outline"
              onLongPress={deleteAllCalls}>
              Delete All Calls
            </Button>
          </Layout>
        )}
        <Button
          style={{
            position: "absolute",
            bottom: 15,
            right: 10,
            shadowRadius: 2,
            shadowOpacity: 0.4,
            shadowOffset: {
              width: 2,
              height: 2,
            },
          }}
          accessoryLeft={PlusIcon}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            navigation.navigate("CallForm");
          }}
        />
      </TouchableWithoutFeedback>
    </Layout>
  );
};

export default DashboardScreen;
