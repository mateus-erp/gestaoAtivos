import { Dimensions } from 'react-native'
import {branco, roxo, escuro, cinza, claro} from '../scenes/cores'

export const theme = {
    container:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: roxo,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    header: {
        marginTop: 30,
        marginBottom: 15,
        paddingRight: 10,
        paddingLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttons:{
        flexDirection: 'column',
        justifyContent: 'space-around',        
    },
    text_header:{
        color: branco,
        fontSize: 28,
    },
    content: {
        backgroundColor: branco,
        borderTopLeftRadius: 35,
        padding: 10,
        justifyContent: 'space-between',
        height: Dimensions.get('window').height-60,
    },
    text_content: {
        color: escuro,
        fontSize: 20,
    },
    actionbox:{
        flexDirection: 'row',
        width: Dimensions.get('window').width-60,
        height: 50,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 15,
        borderRadius:5,
        margin: 5,
    },
    text_actionbox:{
        fontSize:18,
        color: escuro,
        margin: 20,
    },
    icon_actionbox:{
        fontSize:30,
        color: escuro,
        width:35
    },
    actionbutton:{
        flexDirection: 'row',
        width: Dimensions.get('window').width-30,
        backgroundColor: roxo,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5,
        margin: 5,
        marginBottom: 40
    },
    icon_actionbutton:{
        fontSize:30,
        color: branco,
        width:35
    },
    text_actionbutton:{
        fontSize:18,
        color: branco,
   },
}