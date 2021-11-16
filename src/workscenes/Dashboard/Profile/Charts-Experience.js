import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import Cancel from '../../../../assets/images/cancel.svg';
import Nocancel from '../../../../assets/images/nocancel.svg';
import Arrow from '../../../../assets/Arrow.svg'
import chartBG from '../../../../assets/chartBG25.png';
import chartBGIOS from '../../../../assets/chartBG25IOS.png';
import { Platform } from 'react-native';
const windowDimensions = Dimensions.get("window");
const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

let arr = []

export function ChartsExperience({ data, len, hidden }) {

    const [experience, setExperience] = useState([1])
    const [labels, setLabels] = useState([]);
    const [days, setDaysLabels] = useState([]);
    const [valueText1, setValueText1] = useState('');
    const [valueText2, setValueText2] = useState('');
    const kk = len === 7 ? 1.13 : 1.01;

    const step00 = windowWidth * 0.063;
    const step2 = windowWidth * 0.357;
    const step3 = windowWidth * 0.217;
    const step4 = windowWidth * 0.148;
    const step5 = windowWidth * 0.106;
    const step6 = windowWidth * 0.078;
    const step7 = windowWidth * 0.088;

    const margins = [
        [step00, step2],
        [step00, step3, step3],
        [step00, step4, step4, step4],
        [step00, step5, step5, step5, step5],
        [step00, step6, step6, step6, step6, step6],
        [step00, step7, step7, step7, step7, step7, step7],
    ];
    const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const monthDays = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    const getWeekDay = (data, index, last) => {
        if (data && len === 7) {
            return weekDays[(new Date(data)).getDay()]
        }
        if (data && index === 0) {
            const datt = new Date(data);
            return `${'      '}${datt.getDate()}.${(datt.getMonth() + 1).toString().padStart(2, '0')}`;
        }
        if (data && index === last) {
            const datt = new Date(data);
            return `${datt.getDate()}.${(datt.getMonth() + 1).toString().padStart(2, '0')}${'     X'}`;
        }
        return '';
    }

    useEffect(() => {
        const arrIntensity = [];
        const arrLabels = [];
        const arrDays = [];
        const index = Math.max(0, (Math.min(len, data.length) - 2));
        let j = 0;
        for (let i = Math.max(0, data.length - len); i < data.length; i++) {
            arrIntensity.push(Math.ceil(data[i].experience));
            arrDays.push(getWeekDay(data[i].data, j, index + 1));
            if (!hidden) {
                arrLabels.push(
                    <View key={`l${i}`} width={windowWidth * 0.05} height={windowWidth * 0.075} style={{ marginLeft: margins[index][j], alignItems: 'center' }}>
                        {data[i].count > 0
                            ? <Nocancel width={windowWidth * 0.05} />
                            : <Cancel width={windowWidth * 0.05} />}
                    </View>
                );
            }
            j++;
        }
        const text1 = `${data[Math.max(0, data.length - len)].experience}`
        const text2 = `${data[data.length - 1].experience}`

        setValueText1(text1);
        setValueText2(text2);
        setLabels(arrLabels);
        setDaysLabels(arrDays);
        setExperience(arrIntensity);
    }, [])

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: '1%' }}>
                <Text style={styles.intensityTitle}>Опыт</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: '6%' }}>
                    <Text style={styles.intensityTitle1}>{valueText1}</Text>
                    <Arrow style={{ width: 3, height: 3, alignSelf: 'flex-end', marginLeft: 3, marginRight: 5, marginBottom: 2 }} />
                    <Text style={styles.intensityTitle1}>{valueText2}</Text>
                </View>
            </View>
            <Image resizeMode='stretch'
                style={Platform.OS == 'android'
                    ? { position: 'absolute', left: '-1%', top: (hidden ? '7%' : '5%'), zIndex: 1, height: (hidden ? '96%' : '80%'), width: '102%' }
                    : { position: 'absolute', left: '-1%', top: '7%', zIndex: 1, height: '94%', width: '102%' }}
                source={Platform.OS == 'android' ? chartBG: chartBGIOS} />
            <LineChart
                withInnerLines={false}
                data={{
                    labels: days,
                    datasets: [
                        {
                            data: experience,
                            strokeWidth: 2 // optional
                        }
                    ],

                }}
                width={windowWidth * kk}
                height={windowHeight * 0.25}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                withHorizontalLabels={false}
                withOuterLines={false}
                style={{
                    borderRadius: 16,
                    marginLeft: '-8%'
                }}
            />
            { hidden
                ? null
                : <View style={styles.cancel}>
                    {labels}
                  </View>
            }
        </View>
    )
}

const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",

    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `#2A80F1`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: "2",
        strokeWidth: "1",
        stroke: "#2A80F1",
    }
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    container1:{
        width:'98%',
    },
    cancel: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: windowWidth,
        alignItems: 'flex-start',
        marginBottom: '2%',
        marginTop: '2%'
    },
    intensityTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2A80F1",
        marginHorizontal: windowWidth * 0.04,
        fontFamily: "Gilroy-Regular",
        alignSelf: 'flex-start',
        marginLeft: '6%',
    },
    intensityTitle1: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2A80F1",
        fontFamily: "Gilroy-Regular",
        alignSelf: 'flex-end',
    }
});
