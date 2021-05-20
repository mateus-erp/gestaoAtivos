import React from 'react'
import {TouchableOpacity, View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import {theme} from '../themes/darkTheme'

function ActionBox(props){
    const {title, icon} = props

    return (
        <View>
            <TouchableOpacity style={theme.actionbox}>
                <View style={theme.icon_actionbox}>
                    <Icon name={icon} style={theme.icon_actionbox}></Icon>
                </View>            
                <Text style={theme.text_actionbox}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ActionBox