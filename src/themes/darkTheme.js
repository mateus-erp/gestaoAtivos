import { Dimensions } from 'react-native'
import {branco, roxo, escuro, cinza, claro} from '../scenes/cores'

export const theme = {
    container:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: 15,
        backgroundColor: escuro,
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
        marginTop: 40,
        marginLeft: 5,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttons:{
        flexDirection: 'column',
        justifyContent: 'space-around',
        
    },
    text_header:{
        color: claro,
        fontSize: 28,
    },
    content: {
        backgroundColor: cinza,
        padding: 10,
        borderTopLeftRadius: 35,
        justifyContent: 'space-between',
        width: Dimensions.get('window').width-30,
        height: Dimensions.get('window').height-60,
    },
    text_content: {
        color: claro,
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
        color: claro,
        margin: 20,
    },
    icon_actionbox:{
        fontSize:30,
        color: claro,
        width:35
    },
    actionbutton:{
        flexDirection: 'row',
        width: Dimensions.get('window').width-60,
        backgroundColor: roxo,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5,
        margin: 5,
    },
    icon_actionbutton:{
        fontSize:30,
        color: claro,
        width:35
    },
    text_actionbutton:{
        fontSize:18,
        color: claro,
   },
}