/**
 * Created by adam on 2017/4/27.
 */

import React, { PureComponent } from 'react'
import { StyleSheet, Image, TouchableOpacity, View, Alert, TextInput } from 'react-native'

import wake from './WakeOnLan'
import storge from './Stroge'

const macReg = /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/

export default class App extends PureComponent {
  state = {
    name: '',
    mac: '',
    address: '',
    port: '9'
  }

  componentWillMount () {
    storge.load({
      key: 'mac',
      autoSync: false
    }).then((ret) => {
      this.setState({
        mac: ret
      })
    })
  }

  onSend = () => {
    if (macReg.test(this.state.mac)) {
      wake(this.state.mac, (err, res) => {
        if (err) {
          Alert.alert(err.msg || err)
        } else {
          Alert.alert('已发送')
        }
      })
    } else {
      Alert.alert('MAC地址有误!')
    }
  }

  saveInfo = () => {
    storge.save({
      key: 'mac',
      rawData: this.state.mac
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <View style={{
            borderBottomColor: '#ccc',
            borderBottomWidth: 1
          }}
          >
            <TextInput
              autoCorrect={false}
              placeholder={'MAC地址'}
              style={{height: 25, width: 155, color: '#7a7a7a', textAlign: 'center'}}
              value={this.state.mac}
              maxLength={17}
              onChange={(event) => {
                const value = event.nativeEvent.text
                if (!/[^A-Fa-f0-9:]/.test(value)) {
                  this.setState({mac: value})
                }
              }}
              onBlur={this.saveInfo}
            />
          </View>
        </View>
        <View style={styles.switch}>
          <TouchableOpacity onPress={this.onSend}>
            <Image source={require('./assets/switch.png')} style={{width: 150, height: 150}} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  info: {
    flex: 1,
    justifyContent: 'center'
  },
  switch: {
    flex: 2
  }
})
