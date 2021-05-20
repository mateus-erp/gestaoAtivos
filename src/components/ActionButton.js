import React from 'react'
import {TouchableOpacity, View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import {theme} from '../themes/darkTheme'

function ActionButton(props){
    const {title, icon} = props

    return (
        <View>
            <TouchableOpacity style={theme.actionbutton}>
                <View style={theme.icon_actionbutton}>
                    <Icon name={icon} style={theme.icon_actionbutton}></Icon>
                </View>            
                <Text style={theme.text_actionbutton}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ActionButton