import { View } from "react-native";
import MyText from "./MyText";
import { Conversation } from "../types/conversation";
import moment from "moment";
import theme from "../constants/theme";
import { FontAwesome } from "@expo/vector-icons";
import Divider from "./Divider";

const ConversationRow = ({ conversation }: { conversation: Conversation }) => {
  const notificationHasPassed =
    conversation.followUp &&
    moment(conversation.followUp.date).isSameOrAfter(moment());

  const hasNoConversationDetails = !conversation.note?.length;

  return (
    <View
      style={{
        gap: 10,
        backgroundColor: theme.colors.background,
        borderRadius: theme.numbers.borderRadiusLg,
        padding: 15,
      }}
    >
      <MyText
        style={{ fontSize: 12, fontWeight: "600", color: theme.colors.textAlt }}
      >
        {moment(conversation.date).format("MMM DD, YYYY")}
      </MyText>
      {!!conversation.note?.length && <MyText>{conversation.note}</MyText>}
      {hasNoConversationDetails && (
        <MyText>No conversation notes saved.</MyText>
      )}
      {!conversation.followUp?.notifyMe && (
        <View style={{ gap: 5 }}>
          <Divider />
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <FontAwesome name="bell" style={{ color: theme.colors.textAlt }} />
            <MyText
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: theme.colors.textAlt,
              }}
            >
              Follow up information
              {notificationHasPassed ? " - upcoming" : " - past"}
            </MyText>
          </View>
          {conversation.followUp?.date && (
            <MyText
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: notificationHasPassed
                  ? theme.colors.accent3
                  : theme.colors.textAlt,
              }}
            >
              {moment(conversation.followUp.date).format("MMM DD, YYYY h:mm A")}
            </MyText>
          )}
          {conversation.followUp?.topic && (
            <MyText
              style={{
                color: notificationHasPassed
                  ? theme.colors.accent3
                  : theme.colors.textAlt,
              }}
            >
              Topic: {conversation.followUp?.topic}
            </MyText>
          )}
        </View>
      )}
    </View>
  );
};

export default ConversationRow;