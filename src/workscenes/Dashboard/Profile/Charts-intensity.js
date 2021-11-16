import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet,Image } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { defIntensity } from '../../../constants';
import Cancel from '../../../../assets/images/cancel.svg';
import Nocancel from '../../../../assets/images/nocancel.svg';
import chartBG from '../../../../assets/chartBG.png'
import chartBGIOS from '../../../../assets/chartBGIOS.png'
import { Platform } from 'react-native';

const windowDimensions = Dimensions.get("window");
const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

export function ChartsIntensity({ data, len, hidden, koe = 1 }) {

    const [intensity, setIntensity] = useState([1]);
    const [labels, setLabels] = useState([]);
    const [days, setDaysLabels] = useState([]);
    const [valueText, setValueText] = useState('');

    const kk = len === 7 ? 1.13 : 1;
    // hidden = false;

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
        if (data && index === 0 ) {
            const datt = new Date(data);
            return `${'      '}${datt.getDate()}.${datt.getMonth().toString().padStart(2, '0')}`;
        }
        if (data && index === last) {
            const datt = new Date(data);
            return `${datt.getDate()}.${datt.getMonth().toString().padStart(2, '0')}${'     X'}`;
        }
        return '';
    }

    useEffect(() => {
        const arrIntensity = [];
        const arrLabels = [];
        const arrDays = [];
        const index = Math.max(0, (Math.min(len, data.length) - 2));
        let j = 0;
        for ( let i = Math.max(0, data.length - len); i < data.length; i++) {
            arrIntensity.push(Math.min(100, Math.ceil(data[i].countTrue / ( defIntensity * koe) * 100)));
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
            j ++;
        }
        const text = `${Math.min(100, Math.ceil(data[data.length - 1].countTrue / (defIntensity * koe) * 100))}%`;
        setValueText(text);
        setLabels(arrLabels);
        setDaysLabels(arrDays);
        setIntensity(arrIntensity);
    }, [])

    return (
        <View style={styles.container}>
            {hidden && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.intensityTitle}>Интенсивность</Text>
                            <Text style={styles.intensityTitle1}>{valueText}</Text>
                        </View>
            }
            <Image  resizeMode='stretch'
                style={Platform.OS == 'android'
                    ? { position: 'absolute', left:'5%',  top: (hidden ? '14%' : '0%'), zIndex: 1, height: (hidden ? '76%' : '71%'), width: '90%' }
                    : { position: 'absolute', left: '5%', top: (hidden ? '14%' : '0%'), zIndex: 1, height: (hidden ? '76%' : '71%'), width: '90%' }}
                source={Platform.OS == 'android' ? chartBG: chartBGIOS}/>
            <LineChart
                withInnerLines={false}
                data={{
                    labels: days,
                    datasets: [
                        {
                            data: intensity,
                            strokeWidth: 2 // optional
                        },
                        {
                            data: [0],
                            color: () => 'transparent'
                        },
                        {
                            data: [100],
                            color: () => 'transparent'
                        }                        
                    ],

                }}
                width={windowWidth * kk}
                height={windowHeight * 0.25}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                hideLegend={true}
                withShadow={false}
                withOuterLines={false}
                withHorizontalLabels={false}
                style={{
                    borderRadius: 16,
                    marginLeft: '-8%'
                }}
            />
            {hidden
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
        r: "3",
        strokeWidth: "0",
        stroke: "#2A80F1",
    },
};

const styles = StyleSheet.create({
    container: {
        width: windowWidth
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
        marginLeft: '6%',
    },
    intensityTitle1: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2A80F1",
        fontFamily: "Gilroy-Regular",
        alignSelf: 'flex-end',
        marginRight: '6%'
    }
});
