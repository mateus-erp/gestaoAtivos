import React from 'react'
import {TouchableOpacity, View, Text} from 'react-native'

import {theme} from '../themes/darkTheme'

function UsualButton(props, navigation){
    const {title, link} = props

    return (
        <View>
            <TouchableOpacity style={theme.usual_button} onPress={() => link}>
                <Text style={theme.text_usual_button}>${title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default UsualButton