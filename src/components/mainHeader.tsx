import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS } from '../theme/colors';

interface HeaderProps {
    title?: string;
    userName?: string;
    subTitle?: string;
    profileImage?: string; 
    showBackButton?: boolean;
    showSearch?: boolean;
    showSettings?: boolean;
    showNotification?: boolean;

    onBackPress?: () => void;
    onNotificationPress?: () => void;
    onSettingsPress?: () => void;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    title,
    userName,
    subTitle,
    profileImage,

    showBackButton = false,
    showSearch = true,
    showSettings = true,
    showNotification = true,

    onBackPress,
    onNotificationPress,
    onSettingsPress,
    rightIcon,
    onRightIconPress,
}) => {
    return (
        <LinearGradient colors={['#2171D1', '#1958A7']} style={styles.headerContainer}>
            <SafeAreaView>

                <View style={styles.topRow}>
                    <View style={styles.leftSection}>
                        {showBackButton && (
                            <TouchableOpacity
                                style={styles.iconCircle}
                                onPress={onBackPress}
                            >
                                <Feather name="arrow-left" size={20} color={COLORS.white} />
                            </TouchableOpacity>
                        )}
                        {title && (
                            <Text style={[styles.headerTitle, { marginLeft: showBackButton ? 10 : 0 }]} numberOfLines={1}>
                                {title}
                            </Text>
                        )}
                    </View>

                    {/* Right Section */}
                    <View style={styles.rightIcons}>
                        {rightIcon && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {rightIcon}
                            </View>
                        )}

                        {showSettings && (
                            <TouchableOpacity
                                style={styles.actionIcon}
                                onPress={onSettingsPress}
                            >
                                <Feather name="settings" size={20} color={COLORS.white} />
                            </TouchableOpacity>
                        )}

                        {showNotification && (
                            <TouchableOpacity
                                style={styles.actionIcon}
                                onPress={onNotificationPress}
                            >
                                <Feather name="bell" size={20} color={COLORS.white} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Profile */}
                {profileImage && (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: profileImage }}
                            style={styles.profileImg}
                        />
                    </View>
                )}

                {/* Welcome  */}
                {(userName || subTitle) && (
                    <View style={styles.welcomeContainer}>
                        {userName && (
                            <Text style={styles.welcomeText}>
                                {userName}
                            </Text>
                        )}
                        {subTitle && (
                            <Text style={styles.subText}>{subTitle}</Text>
                        )}
                    </View>
                )}

                {/* Search*/}
                {showSearch && (
                    <View style={styles.searchRow}>
                        <View style={styles.searchInputContainer}>
                            <TextInput
                                placeholder="Search"
                                placeholderTextColor="#A0A0A0"
                                style={styles.input}
                            />
                        </View>
                        <TouchableOpacity style={styles.searchButton}>
                            <Feather name="search" size={20} color="#2171D1" />
                        </TouchableOpacity>
                    </View>
                )}

            </SafeAreaView>
        </LinearGradient>
    );
};

export default Header;

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 15,
        paddingBottom: 25,
        minHeight: 130,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        height: 40,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    profileImg: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    leftSection: {
        flexDirection: 'row', 
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 80,
        justifyContent: 'flex-end',
    },
    iconCircle: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIcon: {
        marginLeft: 10,
    },
    welcomeContainer: {
        marginTop: 20,
    },
    welcomeText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '600',
    },
    subText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginTop: 4,
    },
    searchRow: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
    },
    searchInputContainer: {
        flex: 1,
        height: 38,
        backgroundColor: '#EDF6F9',
        borderRadius: 6,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    input: {
        fontSize: 14,
        color: '#333',
        padding: 0,
    },
    searchButton: {
        width: 45,
        height: 38,
        backgroundColor: '#EDF6F9',
        borderRadius: 6,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});