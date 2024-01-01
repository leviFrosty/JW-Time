import { Address, Coordinate } from '../types/contact'
import axios from 'axios'
import { HereGeocodeResponse } from '../types/here'
import apis from '../constants/apis'
import * as Network from 'expo-network'
import * as Sentry from 'sentry-expo'
import { Alert, Linking, Platform } from 'react-native'
import i18n from './locales'
import { countTruthyValueStrings } from './objects'
import * as Location from 'expo-location'
import { DefaultNavigationMapProvider } from '../stores/preferences'
import links from '../constants/links'

export const addressToString = (address?: Address) => {
  if (!address) {
    return ''
  }

  return Object.keys(address)
    .reduce(
      (prev, line, index) =>
        !address[line as keyof Address]?.length
          ? prev
          : (prev += `${index !== 0 ? ' ' : ''}${
              address[line as keyof Address]
            }`),
      ''
    )
    .replace(/(\r\n|\n|\r)/gm, '')
}

export const fetchCoordinateFromAddress = async (
  incrementGeocodeApiCallCount: () => void,
  address?: Address,
  abortController?: AbortController
): Promise<Coordinate | null> => {
  if (!address) {
    return null
  }

  if (countTruthyValueStrings(address) === 0) {
    return null
  }

  const { isInternetReachable } = await Network.getNetworkStateAsync()

  if (!isInternetReachable) {
    Alert.alert(
      i18n.t('internetUnavailable'),
      i18n.t('couldNotFetchCoordinatesFromAddress')
    )
    return null
  }

  try {
    const addressString = addressToString(address)
    const hereApiKey = process.env.HERE_API_KEY

    incrementGeocodeApiCallCount()
    const { data } = await axios.get<HereGeocodeResponse>(
      `${apis.hereGeocode}?apiKey=${hereApiKey}&q=${addressString}`,
      {
        signal: abortController?.signal,
      }
    )

    if (data.items.length === 0) {
      return null
    }

    const position = data.items[0]?.position ? data.items[0].position : null

    if (!position) {
      return null
    }

    return {
      latitude: position.lat,
      longitude: position.lng,
    }
  } catch (error) {
    Sentry.Native.captureException(error)
    return null
  }
}

export const navigateTo = (
  a: Address,
  provider: DefaultNavigationMapProvider
) => {
  const getScheme = () => {
    switch (provider) {
      case 'apple':
        return links.appleMapsBase
      case 'google':
        return links.googleMapsBase
      case 'waze':
        return links.wazeMapsBase
      default:
        if (Platform.OS === 'android') {
          return links.googleMapsBase
        }
        return links.appleMapsBase
    }
  }

  const address = encodeURI(addressToString(a))

  const url = `${getScheme()}${address}`

  try {
    Linking.openURL(url)
  } catch (error) {
    Alert.alert(
      i18n.t('couldNotOpenMaps'),
      i18n.t('couldNotOpenMaps_description')
    )
  }
}

export const requestLocationPermission = async (
  callBack?: (status: boolean) => void
) => {
  const { granted } = await Location.requestForegroundPermissionsAsync()
  callBack?.(granted)
}
