// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// @ts-ignore
import { login, register } from '../services/userService';
// === 1. IMPORT USEAUTH ===
import { useAuth } from '../context/AuthContext'; 

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  // === 2. SỬ DỤNG AUTHCONTEXT ===
  const { authLogin, fetchUserDetails } = useAuth(); 

  const [isLogin, setIsLogin] = useState(true);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userName || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập Tên đăng nhập và Mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      // === 3. LOGIC LOGIN 2 BƯỚC (THEO SCHEMA CỦA BẠN) ===
      // Bước 1: Gọi API login (Bảng Account)
      // Giả sử API login trả về đối tượng Account
      const accountResponse = await login(userName, password); 
      
      // (Sửa 'accountResponse.accountId' nếu API của bạn trả về tên khác)
      const accountId = accountResponse?.accountId || 'ACC001'; // Lấy ID tài khoản

      // Bước 2: Dùng accountId để lấy chi tiết User (Bảng User)
      const userDetails = await fetchUserDetails(accountId);
      
      // Bước 3: Lưu chi tiết User vào AuthContext
      authLogin(userDetails); 

      Alert.alert('Thành công', `Chào mừng ${userDetails.fullName}!`);
      navigation.navigate('MainTabs', { screen: 'Home' });

    } catch (error: any) {
      console.error(error);
      Alert.alert('Đăng nhập thất bại', error?.response?.data?.msg || 'Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!userName || !password || !fullName || !email) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    try {
      // Bước 1: Đăng ký (Tạo Account và User)
      const registerResponse = await register({ userName, password, fullName, email });
      
      // Bước 2: Dùng accountId trả về để lấy chi tiết user
      const accountId = registerResponse?.accountId || 'ACC_NEW';
      const userDetails = await fetchUserDetails(accountId);
      authLogin(userDetails);

      Alert.alert('Thành công', 'Đăng ký thành công! Đang tự động đăng nhập...');
      navigation.navigate('MainTabs', { screen: 'Home' });

    } catch (error: any) {
      console.error(error);
      Alert.alert('Đăng ký thất bại', error?.response?.data?.msg || 'Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

        {!isLogin && (
          <>
            <TextInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            	 mode="outlined"
            />
          </>
        )}

        <TextInput
          label="Username"
          value={userName}
          onChangeText={setUserName}
          style={styles.input}
          autoCapitalize="none"
          mode="outlined"
    	  />
    	  <TextInput
    	   label="Password"
    	   value={password}
    	   onChangeText={setPassword}
    	   style={styles.input}
    	   secureTextEntry
    	   mode="outlined"
    	  />

    	  <Button
    	   mode="contained"
    	   onPress={isLogin ? handleLogin : handleRegister}
    	   loading={loading}
    	   disabled={loading}
    	   style={styles.button}
    	  >
    	   {isLogin ? 'Login' : 'Register'}
    	  </Button>

    	  <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
    	    <Text style={styles.toggleText}>
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
  	   	 </Text>
  	   </TouchableOpacity>
  	 </View>
  	</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
 title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 8 },
  toggleText: { marginTop: 20, textAlign: 'center', color: '#06b6d4' },
});