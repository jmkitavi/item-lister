import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Modal,
  TextInput,
} from 'react-native';
import * as firebase from 'firebase';

import ToolBar from './app/components/ToolBar/ToolBar';
import AddButton from './app/components/AddButton/AddButton'

const styles = require('./app/style')

const firebaseConfig = {
  apiKey: "AIzaSyAaa2Cuiicx_qOTrrsCS_1CntPpWBh13II",
  authDomain: "itemlister-ce6b5.firebaseapp.com",
  databaseURL: "https://itemlister-ce6b5.firebaseio.com",
  projectId: "itemlister-ce6b5",
  storageBucket: "itemlister-ce6b5.appspot.com"
}

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class App extends Component {
  constructor() {
    super();
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      itemDataSource: ds,
      modalVisible: false,
      text: '',
    }

    this.itemsRef = this.getRef().child('items');

    this.renderRow = this.renderRow.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  // componentWillMount() {
  //   this.getItems(this.itemsRef)
  // }

  componentDidMount() {
    this.getItems(this.itemsRef)
  }

  getRef() {
    return firebaseApp.database().ref()
  }

  getItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      let items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        })
      });

      this.setState({
        itemDataSource: this.state.itemDataSource.cloneWithRows(items)
      });

    });
  }

  deleteItem(item) {
    this.itemsRef.child(item._key).remove()
  }

  renderRow(item) {
    return (
      <TouchableHighlight
        onPress={() => { this.deleteItem(item)}}
      >
        <View style={styles.li}>
          <Text style={styles.liText}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  addItem() {
    this.setModalVisible(true)
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}>
          <View style={{marginTop: 22}}>
            <View>
              <ToolBar title='Add Item' />
              <TextInput
                valu e={this.state.text}
                placeholder='Add Items'
                onChangeText={(value) => this.setState({ text: value})}
              />

              <TouchableHighlight
                onPress={() => {
                  this.itemsRef.push({ title: this.state.text})
                  this.setModalVisible(!this.state.modalVisible)
                }}>
                <Text>Save Item</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible)
                }}>
                <Text>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
  
        <ToolBar title='itemLister' />
        <ListView
          dataSource={this.state.itemDataSource}
          renderRow={this.renderRow}
        />
        <AddButton
          onPress={this.addItem.bind(this)}
          title='Add Item'
        />
      </View>
    );
  }
}

