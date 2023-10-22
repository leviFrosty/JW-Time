import { View } from "react-native";
import { useState } from "react";
import Section from "../components/inputs/Section";
import InputRowContainer from "../components/inputs/InputRowContainer";
import theme from "../constants/theme";
import DropDownPicker from "react-native-dropdown-picker";
import MyText from "../components/MyText";
import ActionButton from "../components/ActionButton";
import useServiceReport from "../stores/serviceReport";
import * as Crypto from "expo-crypto";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import { ServiceReport } from "../types/serviceReport";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigation } from "../stacks/RootStack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AddTime = () => {
  const navigation = useNavigation<RootStackNavigation>();
  const insets = useSafeAreaInsets();
  const [serviceReport, setServiceReport] = useState<ServiceReport>({
    id: Crypto.randomUUID(),
    hours: 0,
    minutes: 0,
    date: new Date(),
  });
  const setHours = (hours: number) => {
    setServiceReport({
      ...serviceReport,
      hours,
    });
  };
  const setMinutes = (minutes: number) => {
    setServiceReport({
      ...serviceReport,
      minutes,
    });
  };
  const handleDateChange = (_: DateTimePickerEvent, date: Date | undefined) => {
    if (!date) {
      return;
    }
    setServiceReport({
      ...serviceReport,
      date,
    });
  };

  const [open, setOpen] = useState(false);
  const [minuteOptions, setMinuteOptions] = useState(
    [0, 15, 30, 45].map((value) => ({
      label: `${value}`,
      value: value,
    }))
  );
  const [hourOptions, setHourOptions] = useState(
    [...Array(24).keys()].map((value) => ({
      label: `${value}`,
      value: value,
    }))
  );
  const [hourOpen, setHourOpen] = useState(false);
  const { addServiceReport } = useServiceReport();

  const submit = () => {
    addServiceReport(serviceReport);
    navigation.popToTop();
  };

  return (
    <View
      style={{
        flex: 1,
        flexGrow: 1,
        justifyContent: "space-between",
        marginBottom: insets.bottom + 30,
      }}
    >
      <View style={{ gap: 30 }}>
        <View style={{ padding: 25, gap: 5 }}>
          <MyText style={{ fontSize: 32, fontWeight: "700" }}>Add Time</MyText>
          <MyText style={{ color: theme.colors.textAlt, fontSize: 12 }}>
            Entering time information below will log service time for that day.
          </MyText>
        </View>
        <Section>
          <InputRowContainer
            lastInSection
            label="Date"
            justifyContent="space-between"
          >
            <RNDateTimePicker
              maximumDate={moment().toDate()}
              value={serviceReport.date}
              onChange={handleDateChange}
            />
          </InputRowContainer>
        </Section>
        <Section>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "50%" }}>
              <InputRowContainer label="Hours" lastInSection>
                <DropDownPicker
                  open={hourOpen}
                  value={serviceReport.hours}
                  items={hourOptions}
                  setOpen={setHourOpen}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setValue={(val: any) => setHours(val())}
                  setItems={setHourOptions}
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    width: 100,
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                  }}
                  itemSeparatorStyle={{
                    backgroundColor: theme.colors.border,
                  }}
                  itemSeparator={true}
                />
              </InputRowContainer>
            </View>

            <View style={{ width: "50%" }}>
              <InputRowContainer label="Minutes" lastInSection>
                <DropDownPicker
                  open={open}
                  value={serviceReport.minutes}
                  items={minuteOptions}
                  setOpen={setOpen}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setValue={(val: any) => setMinutes(val())}
                  setItems={setMinuteOptions}
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    width: 100,
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                  }}
                  itemSeparatorStyle={{
                    backgroundColor: theme.colors.border,
                  }}
                  itemSeparator={true}
                />
              </InputRowContainer>
            </View>
          </View>
        </Section>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <ActionButton action={submit} label="Submit" />
      </View>
    </View>
  );
};

export default AddTime;