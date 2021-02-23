import React from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'

const fontFamily = Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold'

export const SelectionModal = ({
    modalOpen,
    setModalOpen,
    selectedTeam,
    selectedTeamOpponent,
    updateUserGamweekChoiceHelper,
}) => {
    return (
        <Modal isVisible={modalOpen}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.confirmText}>Confirm selection</Text>
                    <View>
                        <Text style={styles.text}>You have selected</Text>
                        <Text style={[styles.text, styles.selectedTeamName]}>{selectedTeam.name}</Text>
                    </View>
                    <View>
                        <Text style={styles.text}>against</Text>
                        <Text style={styles.text}>{selectedTeamOpponent.name}</Text>
                    </View>

                    <View style={styles.selectionTextContainer}>
                        {selectedTeam.home ? (
                            <Text style={styles.font}>
                                {selectedTeam.name} are playing at home so they must win for you to advance to the next
                                round
                            </Text>
                        ) : (
                            <Text style={styles.font}>
                                {selectedTeam.name} are playing away so they must win or draw for you to advance to the
                                next round
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.buttonContainers}>
                    <TouchableOpacity onPress={() => setModalOpen(false)} activeOpacity={0.7}>
                        <View style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => updateUserGamweekChoiceHelper()} activeOpacity={0.7}>
                        <View style={[styles.button, styles.submitButton]}>
                            <Text style={styles.submitButtonText}>Confirm</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        padding: 5,
        paddingHorizontal: 30,
    },
    buttonContainers: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
    },
    container: {
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 25,
        marginVertical: 250,
        paddingVertical: 10,
        borderRadius: 5,
        paddingHorizontal: 20,
    },
    cancelButton: {
        borderColor: '#390d40',
    },
    cancelButtonText: {
        color: '#390d40',
        fontFamily,
        fontSize: 15,
        textAlign: 'center',
    },
    confirmText: {
        fontFamily,
        fontSize: 20,
        marginBottom: 20,
    },
    font: {
        fontFamily,
    },
    selectionTextContainer: {
        marginTop: 20,
    },
    selectedTeamName: {
        fontSize: 25,
    },
    submitButton: {
        backgroundColor: '#390d40',
        borderColor: '#390d40',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 15,
        fontFamily,
        textAlign: 'center',
    },
    text: {
        fontFamily,
        textAlign: 'center',
    },
})
