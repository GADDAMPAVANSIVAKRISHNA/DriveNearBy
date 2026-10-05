import { Platform } from 'react-native';

let RealMapViewComponent;
if (Platform.OS === 'web') {
  RealMapViewComponent = require('./RealMapView.web').default;
} else {
  RealMapViewComponent = require('./RealMapView.native').default;
}

export const RealMapView = RealMapViewComponent;
export default RealMapView;
