/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  NativeModules,
  Alert,
  Image,
  TextInput,
  Button,
  Text,
} from 'react-native';


class UserAccountPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      userEmail: "",
      isEditing: false,
    }
  };

  componentDidMount() {
    NativeModules.User.getName()
      .then(result => this.setState({userName: result}))
      .catch(error => Alert.alert("ERROR!", `${error}`));
    NativeModules.User.getEmail()
      .then(result => this.setState({userEmail: result}))
      .catch(error => Alert.alert("ERROR!", `${error}`));
  };

  userNameOnChange = (text) => {
    this.setState({userName: text});
  };

  userEmailOnChange = (text) => {
    this.setState({userEmail: text});
  }


  quitButtonPressed = () => {
    if(this.state.isEditing) {
      Alert.alert("Are you sure?", "It looks like you still have unsaved changes, which are going to be lost.",
      [
        {
          text: "No!",
          style: "cancel"
        },
        {
          text: "Yes, quit!",
          onPress: () => NativeModules.NoteWidgetClickHandler.goToNotesScreen()
        }
      ])
    }
    else {
      NativeModules.NoteWidgetClickHandler.goToNotesScreen();
    }
  };

  saveButtonPressed = () => {
    NativeModules.User.setEmail(this.state.userEmail);
    NativeModules.User.setName(this.state.userName);
    this.setState({isEditing: false});
  }

  editButtonPressed = () => {
    this.setState({isEditing: true});
  };


  render() {
    return (
      <View style={styles.page}>

        <View style={styles.mainPanel}>

          <View style={styles.detailsRightPanel}>
            <Text>User's name:</Text>
            <TextInput style={styles.userNameBox}
              onChangeText={this.userNameOnChange}
              value={this.state.userName}
              editable={this.state.isEditing}
            />

            <Text>User's email:</Text>
            <TextInput style={styles.userEmailBox}
              onChangeText={this.userEmailOnChange}
              value={this.state.userEmail}
              editable={this.state.isEditing}
            />
          </View>
        </View>

        <View style={styles.actionsPanel}>
          <Button title={"Quit!"} onPress={this.quitButtonPressed}/>
          <Button title={"Edit"} disabled={this.state.isEditing} onPress={this.editButtonPressed}/>
          <Button title={"Save"} disabled={!this.state.isEditing} onPress={this.saveButtonPressed}/>
        </View>

      </View>
    );
  }
};


const styles = StyleSheet.create({
  page: {
    margin: 40,
  },
  mainPanel: {
    flex: 0,
    flexDirection: "row",
    height: "85%",
    margin: 20
  },
  avatarLeftPanel: {
    width: 300,
  },
  detailsRightPanel: {
    width: "80%"
  },
  avatarImage: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    borderWidth: 1,
  },
  userEmailBox: {
    width: "80%",
    margin: 30
  },
  userNameBox: {
    width: "80%",
    margin: 30
  },
  actionsPanel: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: "10%"
  },
  avatarButton: {
    width: 110,
    margin: 40,
    marginHorizontal: 45,
  }
});


AppRegistry.registerComponent("UserAccountPanel", () => UserAccountPanel);

export default UserAccountPanel;
