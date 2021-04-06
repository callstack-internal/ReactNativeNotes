/**
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  NativeModules,
  Alert,
} from 'react-native';


export default function NoteWidget(props){
  const {width, ID} = props;

  const [title, setTitle] = useState("");
  const [shortMessage, setShortMessage] = useState("");

  useEffect(() => {
    getNoteTitle();
    getNoteShortMessage();
  }, []);

  const enterNote = () => {
    NativeModules.NoteWidgetClickHandler.openWidget(ID);
  };


  const getNoteTitle = () => {
    NativeModules.Database.getNoteTitle(ID)
      .then(result => setTitle(result))
      .catch(error => Alert.alert("ERROR!", `${error}`));
  };

  const getNoteShortMessage = () => {
    NativeModules.Database.getNoteShortPost(ID)
      .then(result => setShortMessage(result))
      .catch(error => Alert.alert("ERROR!", `${error}`));
  };

  return(
    <TouchableHighlight onPress={enterNote} style={styles.noteWidget} underlayColor={'transparent'}>
      <View style={{width: width}}>

        <View style={styles.noteHeader}>
          <Text>{ID}</Text>
          <View style={styles.noteTitle}>
            <Text style={{textAlign: "center"}}>
              {title}
            </Text>
          </View>
        </View>

        <View style={styles.noteSeparator}></View>

        <View style={styles.noteMainContent}>
          <Text>
            {shortMessage}
          </Text>
        </View>

      </View>
    </TouchableHighlight>
  );
};



const styles = StyleSheet.create({
  noteWidget: {
    borderColor: "grey",
    borderWidth: 1,
    margin: 20,
    backgroundColor: "whitesmoke",
    borderRadius: 10,
    shadowOffset: {x: 5, y: 50},
    shadowColor: "black",
    elevation: 10,
    opacity: 0.8
  },
  noteHeader: {
    flex: 1,
    flexDirection: "row",
    margin: 5,
  },
  noteTitle: {
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginHorizontal: 10,
  },
  noteSeparator: {
    borderColor: "black",
    borderWidth: 0.5,
    marginTop: 5,
    marginBottom: 10,
    alignSelf: "stretch"
  },
  noteMainContent: {
    margin: 10
  }
});


AppRegistry.registerComponent("NoteWidget", () => NoteWidget);

