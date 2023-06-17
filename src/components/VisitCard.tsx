import { Button, Layout, Text, useStyleSheet } from '@ui-kitten/components';
import * as Haptics from 'expo-haptics';
import moment from 'moment';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import appTheme from '../lib/theme';
import { i18n } from '../lib/translations';
import useVisitsStore, { Visit } from '../stores/VisitStore';
import { DeleteIcon } from './Icons';

interface VisitCardProps {
  visit: Visit;
  isFocused?: boolean;
  level?: string;
}

const VisitCard: React.FC<VisitCardProps> = ({ visit, isFocused, level }) => {
  const { deleteVisit } = useVisitsStore();

  const themedStyles = StyleSheet.create({
    section: {
      padding: 10,
      borderRadius: appTheme.borderRadius,
      gap: 15,
    },
    focused: {
      borderColor: 'color-primary-700',
      borderWidth: 2,
    },
  });
  const styles = useStyleSheet(themedStyles);

  const { date, note, partners, placement, topic, videoPlacement } = visit;
  return (
    <Layout
      level={level || '3'}
      style={[isFocused ? styles.focused : {}, styles.section]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ gap: 10 }}>
          <View>
            <Text appearance="hint" category="c2" style={{ marginBottom: 3 }}>
              {moment(date).fromNow()}
            </Text>
            {topic && <Text category="s1">{topic}</Text>}
          </View>
          {note && (
            <View>
              <Text appearance="hint" category="c1">
                {i18n.t('note')}
              </Text>
              <Text>{note}</Text>
            </View>
          )}
          {(placement || videoPlacement) && (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {placement && (
                <View style={{ flex: 1 }}>
                  <Text appearance="hint" category="c1">
                    {i18n.t('placement')}
                  </Text>
                  <Text>{placement}</Text>
                </View>
              )}
              {videoPlacement && (
                <View style={{ flex: 1 }}>
                  <Text appearance="hint" category="c1">
                    {i18n.t('videoPlacement')}
                  </Text>
                  <Text>{videoPlacement}</Text>
                </View>
              )}
            </View>
          )}
          {partners && (
            <View>
              <Text appearance="hint" category="c1">
                {i18n.t('partners')}
              </Text>
              <Text>{partners}</Text>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <Text appearance="hint" category="c1">
            {moment(visit.date).format('MMM DD, YYYY @ h:mm a')}
          </Text>
          <Button
            size="small"
            status="danger"
            appearance="ghost"
            accessoryLeft={DeleteIcon}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.alert(i18n.t('discardVisit'), i18n.t('deleteCaption'), [
                {
                  text: i18n.t('cancel'),
                  style: 'cancel',
                  onPress: () => {},
                },
                {
                  text: i18n.t('discardVisit'),
                  style: 'destructive',
                  // If the user confirmed, then we dispatch the action we blocked earlier
                  // This will continue the action that had triggered the removal of the screen
                  onPress: () => deleteVisit(visit.id),
                },
              ]);
            }}
          />
        </View>
      </View>
    </Layout>
  );
};

export default VisitCard;
