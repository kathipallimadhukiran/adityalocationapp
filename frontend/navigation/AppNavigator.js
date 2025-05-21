import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import Attendance_fig_cam from '../screens/Attendance/Attendance_fig&cam';
import StaffProfileScreen from '../screens/profile/profilescreen';
import ViewSchedulePage from '../screens/Schedule/ViewSchedulePage';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (

        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false,}} />
            <Stack.Screen name="Signup" component={SignupScreen}options={{headerShown: false,}} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MarkAttendance" component={Attendance_fig_cam} options={{ headerShown: true }} />
            <Stack.Screen name="StaffProfile" component={StaffProfileScreen} options={{ headerShown: true }} />

            <Stack.Screen name="SubmitReport" component={StaffProfileScreen} options={{ headerShown: true, headerBackground: "black" }} />
            <Stack.Screen name="ViewSchedule" component={ViewSchedulePage} options={{ headerShown: true }} />
            <Stack.Screen name="RequestLeave" component={StaffProfileScreen} options={{ headerShown: true }} />
            <Stack.Screen name="TrackLocation" component={StaffProfileScreen} options={{ headerShown: true }} />
        </Stack.Navigator>

    );
}

