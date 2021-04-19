/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Alert,
  AppRegistry,
  NativeModules,
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  Button,
} from 'react-native';


const window = Dimensions.get("window");

class NoteWidgetDetailsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      title: "",
      message: "",
      isEditing: false,
      windowHeight: window.height
    }
  };

  componentDidMount() {
    NativeModules.NoteWidgetClickHandler.openedNoteID()
      .then(result => {
        this.setState({id: result});
        this.getNoteTitle();
        this.getNoteMessage();        
      })
      .catch(error => {Alert.alert("ERROR!", `Could not find the opened note\n${error}`)});

    Dimensions.addEventListener("change", this.windowDimensionOnChange);
  };

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.windowDimensionOnChange);
  };

  windowDimensionOnChange = ({window, screen}) => {
    this.setState({windowWidth: window.width, windowHeight: window.height});
  };

  calculateTitleFormWidth = () => {
    return Dimensions.get("window").width - 100;
  };

  calculateMessageFormWidth = () => {
    return Dimensions.get("window").width - 100;
  };

  titleOnChange = (text) => {
    this.setState({title: text});
  };

  messageOnChange = (text) => {
    this.setState({message: text});
  }

  calculateMessagePanelHeight = () => {
    return Dimensions.get("window").height - styles.titlePanel.height - 100;
  };

  getNoteTitle = () => {
    NativeModules.Database.getNoteTitle(this.state.id)
      .then(result => {this.setState({title: result})})
      .catch(error => Alert.alert("ERROR!", `${error}`));
  };

  getNoteMessage = () => {
    NativeModules.Database.getNotePost(this.state.id)
      .then(result => {this.setState({message: result})})
      .catch(error => Alert.alert("ERROR!", `${error}`));
  };

  cancelButtonPressed = () => {
    if(this.state.isEditing) {
      Alert.alert("Are you sure?", "It looks like you still have unsaved changes, which are going to be lost.",
      [
        {
          text: "No!",
          style: "cancel"
        },
        {
          text: "Yes, cancel!",
          onPress: () => NativeModules.NoteWidgetClickHandler.goToNotesScreen()
        }
      ])
    }
    else {
      NativeModules.NoteWidgetClickHandler.goToNotesScreen();
    }
  };

  saveButtonPressed = () => {
    NativeModules.Database.updateNote(this.state.title, this.state.message, this.state.id);
    this.setState({isEditing: false});
  }

  editButtonPressed = () => {
    this.setState({isEditing: true});
  };

  deleteButtonPressed = () => {
    Alert.alert("Are you sure?", "Deleting the note cannot be reversed...",
    [
      {
        text: "No!",
        style: "cancel"
      },
      { text: "Yes, delete!", onPress: () => {
        NativeModules.Database.deleteNote(this.state.id);
        NativeModules.NoteWidgetClickHandler.goToNotesScreen();
      }}
    ])
  };


  render() {
    return (
      <View style={styles.mainPanel}>

        <TextInput style={[styles.titleBox, {width: this.calculateTitleFormWidth()}]}
          onChangeText={this.titleOnChange}
          value={this.state.title}
          autoFocus={true}
          clearButtonMode={"while-editing"}
          placeholder={"Title"}
          editable={this.state.isEditing}
        />

        <TextInput style={[styles.noteMessageBox, { height: this.calculateMessagePanelHeight(), width: this.calculateMessageFormWidth()}]}
          multiline={true}
          onChangeText={this.messageOnChange}
          value={this.state.message}
          placeholder={"Note content"}
          editable={this.state.isEditing}
        />

        <View style={styles.actionsPanel}>
          <Button title={"Cancel!"} onPress={this.cancelButtonPressed}/>
          <Button title={"Edit"} disabled={this.state.isEditing} onPress={this.editButtonPressed}/>
          <Button title={"Save"} disabled={!this.state.isEditing} onPress={this.saveButtonPressed}/>
          <Button title={"Delete"} onPress={this.deleteButtonPressed}/>
        </View>

      </View>
    );
  }
};



const styles = StyleSheet.create({
  mainPanel: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    margin: 30
  },
  titlePanel: {
    height: 60,
  },
  titleBox: {
    height: 35,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderColor: "#D0D0D0",
    color: "blue"
  },
  noteMessageBox: {
    borderWidth: 0.2,
    margin: 10,
    borderColor: "#D0D0D0",
    alignContent: "center",
    textAlignVertical: "center",
  },
  actionsPanel: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    width: 500,
    height: 40,
  }
});


AppRegistry.registerComponent("NoteWidgetDetailsPanel", () => NoteWidgetDetailsPanel);

export default NoteWidgetDetailsPanel;
