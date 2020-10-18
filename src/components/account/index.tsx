import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modalbox'
import AntIcon from 'react-native-vector-icons/AntDesign'

import { ContainerWithHeaderShown, InnerWithHeaderShown } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'
import { signUserOutOfApplication } from '../../firebase-helpers'

export const Account = ({ navigation, setUserExists }) => {
    const [modalOpen, setModalOpen] = useState(false)

    const closeModalHelper = () => {
        // setModalOpen(false)
        navigation.goBack()
    }

    const changePasswordHelper = () => {
        setModalOpen(false)
        navigation.navigate('Home', { screen: 'Reset Password', resetPassword: true })
    }

    return (
        <View>
            <View style={styles.container}>
                {/* <Modal
                    isOpen={modalOpen}
                    animationType="slide"
                    coverScreen={true}
                    onRequestClose={() => setModalOpen(false)}
                    transparent={true}
                    visible={modalOpen}
                    swipeToClose={true}
                    onClosed={closeModalHelper}
                    // style={styles.modalContent}
                > */}
                <View
                    style={{
                        backgroundColor: '#B972FE',
                        borderBottomRightRadius: 150,
                        borderBottomLeftRadius: 150,
                        height: 300,
                        paddingTop: 150,
                    }}
                >
                    <Text style={{ fontSize: 20, textAlign: 'center' }}>Name</Text>
                    <TouchableOpacity onPress={() => closeModalHelper()}>
                        <AntIcon
                            name="close"
                            color="#fff"
                            size={30}
                            style={{ position: 'absolute', right: 30, top: -100 }}
                        />
                    </TouchableOpacity>
                </View>

                <ContainerWithHeaderShown>
                    <InnerWithHeaderShown>
                        <H1> Your Account </H1>
                        <TouchableOpacity onPress={() => signUserOutOfApplication({ navigation, setUserExists })}>
                            <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginBottom: 20 }}>
                                <Text style={{ fontSize: 20, marginBottom: 5 }}>Update Email</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changePasswordHelper()}>
                            <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginBottom: 100 }}>
                                <Text style={{ fontSize: 20, marginBottom: 5 }}>Change Password</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => signUserOutOfApplication({ navigation, setUserExists })}>
                            <View
                                style={{
                                    borderBottomColor: '#ccc',
                                    borderBottomWidth: 1,
                                }}
                            >
                                <Text style={{ fontSize: 20, marginBottom: 5 }}>Sign out</Text>
                            </View>
                        </TouchableOpacity>
                    </InnerWithHeaderShown>
                </ContainerWithHeaderShown>
                {/* </Modal> */}
            </View>
        </View>
    )
}

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        width,
    },
    modalContent: {
        margin: 0,
    },
    modalContainer: {
        justifyContent: 'center',
    },
    innerContainer: {
        position: 'absolute',
        bottom: 0,
        opacity: 1,
        alignItems: 'center',
        backgroundColor: '#ccc',
        width,
    },
})
