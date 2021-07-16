/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
  Alert,
  AppRegistry,
  Dimensions,
  FlatList,
  Image,
  NativeEventEmitter,
  NativeModules,
  StyleSheet,
} from 'react-native';
import NoteWidget from './Widgets/NoteWidget';
import Colors from './Resources/Colors';
import * as theming from './Resources/Theming/ThemeHOC';

const noteWidgetWidth = 300;
const SettingsNotificationModuleEventEmitter = new NativeEventEmitter(
  NativeModules.Database,
);

function calculateColumnWidth() {
  return Math.floor(Dimensions.get('window').width / noteWidgetWidth);
}

interface Props {}

interface INote {
  key: number;
  title: string;
  shortMessage: string;
}

interface State {
  notes: Array<INote>;
  columns: number;
  language: number;
  theme: number;
}

class NotesMainPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      notes: [],
      columns: calculateColumnWidth(),
      language: 0,
      theme: 0,
    };
  }

  onChange = () => {
    this.setState({
      columns: calculateColumnWidth(),
    });
  };

  componentDidMount() {
    this.getDataFromDatabase();
    Dimensions.addEventListener('change', this.onChange);
    SettingsNotificationModuleEventEmitter.addListener(
      'LanguageChanged',
      (result) => {
        this.setState({language: result});
      },
    );
    SettingsNotificationModuleEventEmitter.addListener(
      'ThemeChanged',
      (result) => {
        this.setState({theme: result});
      },
    );
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onChange);
  }

  createNotesKeys = async (notesIDs: Array<INote>) => {
    this.setState({notes: notesIDs});
  };

  getDataFromDatabase = async () => {
    await NativeModules.Database.getAllNotesIDs()
      .then((result: Array<INote>) => this.createNotesKeys(result))
      .catch((error: Error) =>
        Alert.alert('ERROR!', `Result: ${error.message}`),
      );
  };

  renderWelcomePage = () => {
    return (
      <theming.ThemedView style={styles.welcomePage}>
        <Image
          style={styles.logoImage}
          accessibilityIgnoresInvertColors
          source={require('../Resources/img/logo_RNN_pion_white_logotype_resized.png')}
        />
      </theming.ThemedView>
    );
  };

  renderNotesPage = () => {
    return (
      <theming.ThemedView style={styles.mainContainer}>
        <FlatList<INote>
          key={this.state.columns}
          numColumns={this.state.columns}
          data={this.state.notes}
          renderItem={({item}) => (
            <NoteWidget
              width={noteWidgetWidth}
              id={item.key}
              title={item.title}
              shortMessage={item.shortMessage}
            />
          )}
        />
      </theming.ThemedView>
    );
  };

  render() {
    if (this.state.notes.length > 0) {
      return this.renderNotesPage();
    } else {
      return this.renderWelcomePage();
    }
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    margin: 25,
    flexDirection: 'column',
    backgroundColor: Colors.transparent,
    justifyContent: 'space-around',
  },
  welcomePage: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  logoImage: {
    resizeMode: 'stretch',
  },
});

AppRegistry.registerComponent('NotesMainPanel', () => NotesMainPanel);

export default NotesMainPanel;
