import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const color = {
    primary: '#80C5De',
    white: '#ffffff',
    gray: '#C4C4C4',
}
export default function ListWater({ navigation }) {

    const listTime1 = [
        { id: 1, name: 'water1', time: '12.20', duration: '20' },
        { id: 2, name: 'water2', time: '22.00', duration: '120' },
        { id: 3, name: 'water3', time: '07.30', duration: '30' }
    ];

    const [listTime, setListTime] = useState([]);
    const [servoID, setServoID] = useState([]);
    const [startHour, setStartHour] = useState([]);
    const [startMinute, setStartMinute] = useState([]);
    const [duration, setDuration] = useState([]);
    // console.log(listTime)
    // console.log(listTime1)

    function setFormatListTime(servoID, startHour, startMinute, duration) {
        for (let i = 0; i < servoID.length; i++) {
            // setListtime('waterตัวที่ ' + servoID[i] + 'ทำงานเมื่อ' + startHour[i] + ':' + startMinute[i] + '   เป็นระยะเวลา : ' + duration[i]);
            listTime.push({ id: servoID[i], name: 'Waterตัวที่ ' + servoID[i], time: (startHour[i] + ':' + startMinute[i]), duration: duration[i] })
            // console.log(listTime)
        }
    }

    useEffect(() => {
        fetchData();

    }, [])

    function fetchData() {
        const db = getDatabase();
        let userId = 'user1'; // Edit To User ID 
        const reference = ref(db, 'user/' + userId);
        onValue(reference, (snapshot) => {
            setServoID(snapshot.val().farm.servo.timer.servoID); // set เลขของ servo
            setStartHour(snapshot.val().farm.servo.timer.startHour); // set เวลาที่เริ่มทำงาน ชั่วโฒง
            setStartMinute(snapshot.val().farm.servo.timer.startMinute); // set เวลาที่เริ่มทำงาน นาที
            setDuration(snapshot.val().farm.servo.timer.duration); // set ระยะเวลาที่ทำงาน
            // console.log(snapshot.val().farm.servo.timer.servoID)
            // console.log(snapshot.val().farm.servo.timer.startHour)
            // console.log(snapshot.val().farm.servo.timer.startMinute)
            // console.log(snapshot.val().farm.servo.timer.duration)
            // ID , startHour , startMinute , duration
            //ทุกๆอันจะมี array ซ่อนอยู่ 
            //ใช้เลข index ในการดูว่าอันไหนตรงกัน
            //array[]
        })
    }
    setFormatListTime(servoID, startHour, startMinute, duration);

    const Item = ({ id, name, time, duration }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{name}</Text>
            <Text>เวลาเริ่มทำงาน : {time} น.</Text>
            <Text>ระยะเวลาทำงาน : {duration}</Text>
        </View>
    );
    const renderItem = ({ item }) => (
        <Item id={item.id} name={item.name} time={item.time} duration={item.duration} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={listTime}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <View>
                <TouchableOpacity color={color.primary} onPress={() => navigation.navigate('SetTimeWater')} style={styles.submitButton}>
                    <View
                        style={{
                            backgroundColor: color.white,
                            width: 200,
                            padding: 5,
                            borderRadius: 10,
                            marginBottom: 20,
                            alignContent: 'center',
                        }}>
                        <Text style={styles.labelButton}>Add Set Time</Text>
                    </View>

                </TouchableOpacity>
            </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelButton: {
        color: '#878787',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',

    },
    item: {
        width: 350,
        backgroundColor: color.primary,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20
    },
    title: {
        fontSize: 24,
    },
});