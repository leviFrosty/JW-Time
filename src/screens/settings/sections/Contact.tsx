import { Alert, View } from 'react-native'
import i18n from '../../../lib/locales'
import Section from '../../../components/inputs/Section'
import InputRowButton from '../../../components/inputs/InputRowButton'
import {
  faBug,
  faChevronRight,
  faHand,
} from '@fortawesome/free-solid-svg-icons'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Linking from 'expo-linking'
import IconButton from '../../../components/IconButton'
import SettingsSectionTitle from '../shared/SettingsSectionTitle'

const ContactSection = () => {
  return (
    <View style={{ gap: 3 }}>
      <SettingsSectionTitle text={i18n.t('contact')} />
      <Section>
        <InputRowButton
          leftIcon={faBug}
          label={i18n.t('bugReport')}
          onPress={async () => {
            const email = 'levi.wilkerson@proton.me'
            const subjectText = '[JW Time] Bug Report'
            const bodyText = `App Version: v${Constants.expoConfig
              ?.version}, Device: ${Device.modelName}, OS: ${
              Device.osVersion
            }. ${i18n.t('pleaseDescribeYourIssue')}: --------------`
            const subject = encodeURIComponent(subjectText)
            const body = encodeURIComponent(bodyText)
            try {
              await Linking.openURL(
                `mailto:${email}?subject=${subject}&body=${body}`
              )
            } catch (error) {
              Alert.alert(
                i18n.t('error'),
                i18n.t('failedToOpenMailApplication')
              )
            }
          }}
        >
          <IconButton icon={faChevronRight} />
        </InputRowButton>
        <InputRowButton
          lastInSection
          leftIcon={faHand}
          label={i18n.t('featureRequest')}
          onPress={async () => {
            const email = 'levi.wilkerson@proton.me'
            const subjectText = '[JW Time] Feature Request'
            const bodyText = `App Version: v${Constants.expoConfig
              ?.version}, Device: ${Device.modelName}, OS: ${
              Device.osVersion
            }. ${i18n.t('pleaseDescribeYourFeatureClearly')}: --------------`
            const subject = encodeURIComponent(subjectText)
            const body = encodeURIComponent(bodyText)
            try {
              await Linking.openURL(
                `mailto:${email}?subject=${subject}&body=${body}`
              )
            } catch (error) {
              Alert.alert(
                i18n.t('error'),
                i18n.t('failedToOpenMailApplication')
              )
            }
          }}
        >
          <IconButton icon={faChevronRight} />
        </InputRowButton>
      </Section>
    </View>
  )
}

export default ContactSection
