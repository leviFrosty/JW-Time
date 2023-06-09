import {
  Icon,
  IconElement,
  Layout,
  Text,
  useStyleSheet,
} from "@ui-kitten/components";
import moment from "moment";
import { StyleSheet, View } from "react-native";

import appTheme from "../lib/theme";
import { i18n } from "../lib/translations";
import { Call } from "../stores/CallStore";
import {
  MonthReportData,
  ServiceRecord,
  hourInMS,
} from "../stores/ServiceRecord";
import useSettingStore from "../stores/SettingsStore";
import { Visit } from "../stores/VisitStore";
import ReportHours from "./ReportHours";

export const isSameMonthAndYear = (
  date: moment.Moment,
  month: number,
  year: number,
) =>
  moment(date).month() === month &&
  (year
    ? moment(date).year() === year
    : moment(date).year() === moment().year());

export const parseForMonthReport = ({
  calls,
  visits,
  records,
  month,
  year: yearFromProps,
}: {
  calls: Call[];
  visits: Visit[];
  records: ServiceRecord[];
  month: number; // pass from moment().month(), or moment(date).month() Valid values = 1-12
  year?: number;
}): MonthReportData => {
  const year = yearFromProps || moment().year();

  const visitsThisMonth = visits.filter(visit =>
    isSameMonthAndYear(visit.date, month, year),
  );
  const recordsThisMonth = records.filter(record =>
    isSameMonthAndYear(record.date, month, year),
  );

  const timeInMS = recordsThisMonth.reduce(
    (add, record) => add + record.time,
    0,
  );
  const hours = Math.floor(timeInMS / hourInMS);

  const placementOffset = recordsThisMonth.reduce(
    (count, record) => count + record.placements,
    0,
  );
  const videoPlacementOffset = recordsThisMonth.reduce(
    (count, record) => count + record.videoPlacements,
    0,
  );
  const returnVisitsOffset = recordsThisMonth.reduce(
    (count, record) => count + record.placements,
    0,
  );

  const studiesOffset = recordsThisMonth.reduce(
    (count, record) => count + record.studyOffset,
    0,
  );

  const placementsThisMonth = visitsThisMonth.reduce(
    (placementCount, visit) =>
      !visit.placement ? placementCount + 0 : placementCount + 1,
    0,
  );

  const videoPlacementsThisMonth = visitsThisMonth.reduce(
    (placementCount, visit) =>
      !visit.videoPlacement ? placementCount + 0 : placementCount + 1,
    0,
  );

  const automatedReturnVisits = calls.reduce((totalCount, call) => {
    const callVisits = visits.filter(v => v.call.id === call.id);
    const callVisitsForMonth = callVisits.reduce((callCount, visit, index) => {
      if (index === 0) {
        return callCount + 0;
      } else {
        if (isSameMonthAndYear(visit.date, month, year)) {
          return callCount + 1;
        } else {
          return callCount + 0;
        }
      }
    }, 0);
    return totalCount + callVisitsForMonth;
  }, 0);

  const automatedStudies = calls.reduce((count, call) => {
    if (
      call.isStudy &&
      visitsThisMonth.filter(v => v.call.id === call.id).length > 0
    ) {
      return count + 1;
    } else {
      return count;
    }
  }, 0);

  const placements = placementOffset + placementsThisMonth;
  const videoPlacements = videoPlacementOffset + videoPlacementsThisMonth;
  const studies = automatedStudies + studiesOffset;
  const returnVisits = automatedReturnVisits + returnVisitsOffset;

  const monthDisplay = month ? moment().month(month).format("MMMM") : "";
  const yearDisplay = year ? `, ${moment().year(year).format("YYYY")}` : "";
  const title = `${
    monthDisplay || yearDisplay ? `${monthDisplay}${yearDisplay} ` : ""
  }${i18n.t("serviceReport")}`;

  return {
    hours,
    placements,
    videoPlacements,
    returnVisits,
    studies,
    month,
    year,

    share: {
      title,
      message: `${title}\n${formatReportForSharing({
        hours,
        placements,
        returnVisits,
        studies,
        videoPlacements,
      })}`.trim(),
    },
  };
};

export const formatReportForSharing = ({
  hours,
  placements,
  videoPlacements,
  returnVisits,
  studies,
}: {
  hours: number;
  placements: number;
  videoPlacements: number;
  returnVisits: number;
  studies?: number;
}): string => {
  const json = JSON.stringify(
    {
      hours,
      placements,
      videoPlacements,
      returnVisits,
      studies: studies || undefined,
    },
    null,
    2,
  );
  const lines = json.split("\n");
  const formattedLines = lines.map(line => line.trim());
  let formattedJSON = formattedLines.join("\n").replace(/["{},]/g, "");
  formattedJSON = formattedJSON.replace("hours", i18n.t("hours"));
  formattedJSON = formattedJSON.replace("placements", i18n.t("placements"));
  formattedJSON = formattedJSON.replace(
    "videoPlacements",
    i18n.t("videoPlacements"),
  );
  formattedJSON = formattedJSON.replace("returnVisits", i18n.t("returnVisits"));
  formattedJSON = formattedJSON.replace("studies", i18n.t("studies"));
  return formattedJSON.trim();
};

interface MonthReportProps {
  report: MonthReportData;
  hideArrow?: boolean;
}

const MonthReport: React.FC<MonthReportProps> = ({ report, hideArrow }) => {
  const { hours, placements, returnVisits, studies, videoPlacements } = report;
  const {
    user: { monthlyTargetHours },
  } = useSettingStore();
  const themeStyles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: "border-primary-color-1",
      borderRadius: appTheme.borderRadius,
      paddingHorizontal: 15,
      paddingTop: 15,
      paddingBottom: monthlyTargetHours ? 5 : 15,
      gap: 5,
    },
    arrow: {
      position: "absolute",
      bottom: 8,
      right: 8,
      justifyContent: "flex-end",
    },
    content: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    box: {
      gap: 10,
    },
    number: {
      textAlign: "center",
    },
    chevronRight: {
      marginTop: 10,
      height: 15,
      width: 15,
      color: "text-hint-color",
    },
  });
  const styles = useStyleSheet(themeStyles);

  const ChevronRight = (): IconElement => (
    <Icon style={styles.chevronRight} name={"chevron-right"} />
  );

  return (
    <Layout level="2" style={styles.container}>
      <View style={styles.content}>
        <View style={styles.box}>
          <Text appearance="hint" category="c2">
            {i18n.t("hours")}
          </Text>
          <ReportHours hours={hours} target={monthlyTargetHours} />
        </View>
        <View style={styles.box}>
          <Text appearance="hint" category="c2">
            {i18n.t("placements")}
          </Text>
          <Text category="h6" style={styles.number}>
            {placements}
          </Text>
        </View>
        <View style={styles.box}>
          <Text appearance="hint" category="c2">
            {i18n.t("videos")}
          </Text>
          <Text category="h6" style={styles.number}>
            {videoPlacements}
          </Text>
        </View>
        <View style={styles.box}>
          <Text appearance="hint" category="c2">
            {i18n.t("returnVisits")}
          </Text>
          <Text category="h6" style={styles.number}>
            {returnVisits}
          </Text>
        </View>
        <View style={styles.box}>
          <Text appearance="hint" category="c2">
            {i18n.t("studies")}
          </Text>
          <Text category="h6" style={styles.number}>
            {studies}
          </Text>
        </View>
      </View>
      <View style={styles.arrow}>{!hideArrow && <ChevronRight />}</View>
    </Layout>
  );
};

export default MonthReport;
