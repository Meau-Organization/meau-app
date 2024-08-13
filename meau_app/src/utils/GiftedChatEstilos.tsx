import { StyleSheet, Text, View } from "react-native";
import { Send, Message as GiftedMessage, Bubble, Time } from "react-native-gifted-chat";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const renderSend = (props) => {
    return (
        <Send {...props}>
           
            <View style={{
                width: 36,
                height: 36,
                borderRadius: 100,
                backgroundColor: '#88c9bf',
                marginRight: 10,
                marginBottom: 5,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <MaterialIcons name="send" size={24} color="#fff" />
            </View>
        </Send>
    );
};

export const renderMsg = (props) => {
    return (
        <View style={{ backgroundColor: '#fafafa' }}>
            <GiftedMessage {...props} />
        </View>
    );
};

export const renderDay = (props) => {
    const { currentMessage, previousMessage } = props;

    // Data uma vez ao dia no chat
    const mostrarData = !previousMessage || new Date(previousMessage.createdAt).toDateString() !== new Date(currentMessage.createdAt).toDateString();

    if (!mostrarData) return null;

    return (
        <View style={{ padding: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#999' }}>
                { format(new Date(currentMessage.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) }
            </Text>
        </View>
    );
};

export const renderBalaoMsg = (props) => {
    const { currentMessage } = props;
    const lido: boolean = currentMessage.lido;

    return (
        <View style={styles.balaoMsg}>
            <Bubble {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#f0f0f0'
                    },
                    right: {
                        paddingRight: 11,
                        backgroundColor: '#cfe9e5'
                    },
                }}
                textStyle={{
                    left: {
                        color: '#000',
                        fontSize: 16,
                    },
                    right: {
                        color: '#000',
                        fontSize: 16,
                    },
                }}
                renderTime={(timeProps) => (
                    <Time
                        {...timeProps}
                        timeTextStyle={{
                            left: {
                                color: '#000',
                                fontSize: 12
                            },
                            right: {
                                color: '#000',
                                fontSize: 12
                            },
                        }}
                    />
                )}

            />
            <View style={styles.iconeContainer}>
                <MaterialCommunityIcons name="check-all" size={15} style={{ color: lido ? '#ffd358' : '#b1b1b1', textShadowOffset: { width: -0.4, height: 0.8 },
          textShadowRadius: 0.5, shadowColor: '#314240' }} />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    balaoMsg: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    iconeContainer: {
        marginLeft: -26,
        marginBottom: 5,
        justifyContent: 'center',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        width: 30,
        alignItems: 'center',
    },

});