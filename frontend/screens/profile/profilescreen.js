import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';

const StaffProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const staff = route.params?.staff || {
    id: 'EMP001',
    name: 'Dr. Sarah Johnson',
    role: 'Senior Lecturer',
    department: 'Computer Science',
    email: 's.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    joinDate: '15 March 2018',
    office: 'Block B, Room 205',
    qualifications: 'PhD in Computer Science, M.Sc. in AI',
    bio: 'Specialized in Artificial Intelligence and Machine Learning with 10+ years of teaching experience.',
    // profilePhoto: require('../../assets/default-profile.jpg')
  };

  const handleEditProfile = () => {
    navigation.navigate('EditStaffProfile', { staff });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image 
            source={staff.profilePhoto} 
            style={styles.avatar}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.editPhotoButton}>
            <Icon name="camera" size={16} color="#1D3557" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name}>{staff.name}</Text>
        <Text style={styles.role}>{staff.role}</Text>
        <Text style={styles.department}>{staff.department} Department</Text>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Icon name="pen" size={14} color="#fff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.detailRow}>
          <Icon name="id-card" size={18} color="#457B9D" style={styles.detailIcon} />
          <View>
            <Text style={styles.detailLabel}>Staff ID</Text>
            <Text style={styles.detailValue}>{staff.id}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="envelope" size={18} color="#457B9D" style={styles.detailIcon} />
          <View>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{staff.email}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="phone" size={18} color="#457B9D" style={styles.detailIcon} />
          <View>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{staff.phone}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="calendar-alt" size={18} color="#457B9D" style={styles.detailIcon} />
          <View>
            <Text style={styles.detailLabel}>Join Date</Text>
            <Text style={styles.detailValue}>{staff.joinDate}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="building" size={18} color="#457B9D" style={styles.detailIcon} />
          <View>
            <Text style={styles.detailLabel}>Office</Text>
            <Text style={styles.detailValue}>{staff.office}</Text>
          </View>
        </View>
      </View>

      {/* Qualifications Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Qualifications</Text>
        <Text style={styles.qualificationsText}>{staff.qualifications}</Text>
      </View>

      {/* Bio Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bioText}>{staff.bio}</Text>
      </View>

      {/* Emergency Contact (Optional) */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        <View style={styles.detailRow}>
          <Icon name="user-shield" size={18} color="#457B9D" style={styles.detailIcon} />
          <View>
            <Text style={styles.detailLabel}>Contact Person</Text>
            <Text style={styles.detailValue}>Michael Johnson (Spouse)</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Icon name="phone-alt" size={18} color="#457B9D" style={styles.detailIcon} />
          <View>
            <Text style={styles.detailLabel}>Emergency Number</Text>
            <Text style={styles.detailValue}>+1 (555) 987-6543</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#1D3557',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editPhotoButton: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  role: {
    fontSize: 18,
    color: '#A8DADC',
    marginBottom: 3,
  },
  department: {
    fontSize: 16,
    color: '#A8DADC',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#457B9D',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 3,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  detailsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D3557',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  detailIcon: {
    width: 40,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  qualificationsText: {
    fontSize: 15,
    color: '#495057',
    lineHeight: 22,
  },
  bioText: {
    fontSize: 15,
    color: '#495057',
    lineHeight: 22,
  },
});

export default StaffProfileScreen;