import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    View,
} from 'react-native';
import {
    Appbar,
    Button,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';

export default function ChangeEmailScreen() {
    const router = useRouter();
    const theme = useTheme();
    const [email, setEmail] = useState('11@aa.com');
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!email.trim()) {
            Alert.alert('错误', '请输入邮箱地址');
            return;
        }

        if (!email.includes('@')) {
            Alert.alert('错误', '请输入有效的邮箱地址');
            return;
        }

        if (!verificationCode.trim()) {
            Alert.alert('错误', '请输入验证码');
            return;
        }

        setIsLoading(true);

        // 模拟保存操作
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert('成功', '邮箱地址修改成功');
            router.back();
        }, 1500);
    };

    const handleSendVerificationCode = () => {
        // 模拟发送验证码
        Alert.alert('提示', '验证码已发送到您的邮箱');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.surface }]}>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="修改邮箱" />
            </Appbar.Header>

            <View style={styles.content}>
                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                        邮箱地址
                    </Text>
                    <TextInput
                        mode="outlined"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="请输入邮箱地址"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                    />
                </View>

                <View >
                    <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                        我们将发送验证链接到您的新邮箱地址，请查收
                    </Text>
                </View>
                <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.saveButton}
                    contentStyle={styles.saveButtonContent}
                >
                    提交
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        elevation: 0,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'transparent',
    },
    verificationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verificationInput: {
        flex: 1,
        marginRight: 12,
    },
    verificationButton: {
        minWidth: 100,
    },
    verificationButtonText: {
        fontSize: 12,
    },
    saveButton: {
        marginTop: 32,
        borderRadius: 8,
    },
    saveButtonContent: {
        paddingVertical: 8,
    },
});
