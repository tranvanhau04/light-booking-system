// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { login, register } from '../services/userService'; // <-- Import service

export default function LoginScreen() {
  const navigation = useNavigation<any>(); // <-- Dùng để chuyển trang
  const [isLogin, setIsLogin] = useState(true); // Chuyển đổi giữa Login/Register

  // States cho form
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Chỉ dùng cho Register
  const [email, setEmail] = useState('');       // Chỉ dùng cho Register
  
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userName || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập Tên đăng nhập và Mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      // 1. Gọi API login
      await login(userName, password);
      
      // 2. Nếu thành công, đi đến trang tìm kiếm (hoặc trang Home)
      Alert.alert('Thành công', 'Đăng nhập thành công!');
      navigation.navigate('MainTabs', { screen: 'Home' }); // <-- Tên màn hình tìm kiếm của bạn
    
    } catch (error: any) {
      // 3. Nếu thất bại, hiển thị lỗi
      console.error(error);
      Alert.alert('Đăng nhập thất bại', error.response?.data?.msg || 'Không thể kết nối server');
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
      // 1. Gọi API register
      await register({ userName, password, fullName, email });
      
      // 2. Nếu thành công, tự động đăng nhập và đi đến trang tìm kiếm
      Alert.alert('Thành công', 'Đăng ký thành công! Đang tự động đăng nhập...');
      navigation.navigate('FlightSearching');
      
    } catch (error: any) {
      // 3. Nếu thất bại (ví dụ: Tên đăng nhập đã tồn tại)
      console.error(error);
      Alert.alert('Đăng ký thất bại', error.response?.data?.msg || 'Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
        
        {/* Chỉ hiển thị các trường này khi Đăng ký */}
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
        
        {/* Các trường chung */}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  toggleText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#06b6d4',
  },
});