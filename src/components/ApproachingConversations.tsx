import Text from './MyText'
import i18n from '../lib/locales'
import CardWithTitle from './CardWithTitle'
import { Conversation } from '../types/conversation'
import { ThemeContext } from '../contexts/theme'
import { useContext, useMemo } from 'react'
import { View } from 'react-native'
import IconButton from './IconButton'
import ApproachingConversationRow from './ApproachingConversationsRow'
import moment from 'moment'
import { faPersonRunning, faThumbtack } from '@fortawesome/free-solid-svg-icons'

interface Props {
  conversations: Conversation[]
}

const ApproachingConversations = ({ conversations }: Props) => {
  const theme = useContext(ThemeContext)

  const now = moment()
  const endOfDay = moment().endOf('day').hour(16) // 4:59:59 PM

  const isMorning = now.isBefore(endOfDay)

  const conversationsSortedByFollowUpDate = useMemo(
    () =>
      conversations.sort(
        (a, b) =>
          moment(a.followUp?.date).unix() - moment(b.followUp?.date).unix()
      ),
    [conversations]
  )

  return (
    <CardWithTitle
      title={
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          <IconButton
            icon={isMorning ? faPersonRunning : faThumbtack}
            iconStyle={{ color: theme.colors.accent }}
          />
          <Text
            style={{
              fontSize: theme.fontSize('xl'),
              color: theme.colors.accent,
              fontFamily: theme.fonts.bold,
            }}
          >
            {isMorning
              ? i18n.t('todaysConversations')
              : i18n.t('upcomingConversations')}
          </Text>
        </View>
      }
      titlePosition='inside'
      titleColor={theme.colors.accent}
      style={{
        borderColor: theme.colors.accent,
        borderWidth: 1,
        borderRadius: theme.numbers.borderRadiusLg,
      }}
    >
      {conversationsSortedByFollowUpDate.map((c) => (
        <ApproachingConversationRow key={c.id} conversation={c} />
      ))}
    </CardWithTitle>
  )
}

export default ApproachingConversations
