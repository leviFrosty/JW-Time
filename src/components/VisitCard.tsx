import { Layout, Text, useStyleSheet } from '@ui-kitten/components';
import moment from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import appTheme from '../lib/theme';
import { i18n } from '../lib/translations';
import { Visit } from '../stores/VisitStore';

interface VisitCardProps {
  visit: Visit;
  isFocused?: boolean;
  level?: string;
}

const VisitCard: React.FC<VisitCardProps> = ({ visit, isFocused, level }) => {
  // const { deleteVisit } = useVisitsStore();
  const themedStyles = StyleSheet.create({
    section: {
      padding: 10,
      borderRadius: appTheme.borderRadius,
      gap: 15,
    },
    focused: {
      borderColor: 'color-primary-800',
      borderWidth: 2,
    },
  });
  const styles = useStyleSheet(themedStyles);

  const { date, note, partners, placement, topic, videoPlacement } = visit;
  return (
    <Layout
      level={level || '3'}
      style={[isFocused ? styles.focused : {}, styles.section]}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text appearance="hint" category="c2" style={{ marginBottom: 3 }}>
            {moment(date).fromNow()}
          </Text>
          <Text appearance="hint" category="c1">
            {moment(date).format('MM/DD/YY h:mmA')}
          </Text>
        </View>
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
    </Layout>
  );
};

export default VisitCard;
