import { AppRegistry } from 'react-native'
import { Routing } from './src/routing'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => Routing)
