import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./Onboarding.styles";
import { FontAwesome } from "@expo/vector-icons";

interface Props {
  noActions?: boolean;
  goBack: () => void;
  setOnboardingComplete: (val: boolean) => void;
}

const OnboardingNav = ({ noActions, goBack, setOnboardingComplete }: Props) => {
  return (
    <View style={styles.navContainer}>
      {!noActions ? (
        <TouchableOpacity hitSlop={20} style={styles.navBack} onPress={goBack}>
          <FontAwesome style={styles.chevronLeft} name="chevron-left" />
        </TouchableOpacity>
      ) : null}
      <Text style={styles.navTitle}>JW Time</Text>
    </View>
  );
};

export default OnboardingNav;