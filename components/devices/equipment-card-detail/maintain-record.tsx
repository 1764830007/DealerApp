import { StyleSheet, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Card, Icon, Text } from "react-native-paper";

export default function MaintainRecord() {
  return (
    <GestureHandlerRootView>
      <ScrollView>
        <Card
          mode="contained"
          style={{ marginTop: 10, borderRadius: 5, backgroundColor: "#fff" }}
        >
          <Card.Title
            title="SEMFW202510130001"
            rightStyle={{ marginRight: 15 }}
            titleStyle={{
              alignContent: "center",
              fontSize: 14,
              fontWeight: 500,
            }}
            style={{ backgroundColor: "#e4ebf3", minHeight: 40 }}
            
          />
          <Card.Content>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View style={{ padding: 10 }}>
                  <View style={{flexDirection: 'row', 
                      justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Text style={styles.cardTitle}>产品型号</Text>
                      <Text style={styles.cartDesc}>SEM660D</Text>
                  </View>
                  <View style={{flexDirection: 'row', 
                      justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Text style={styles.cardTitle}>产品序列号</Text>
                      <Text style={styles.cartDesc}>s6200023030</Text>
                  </View>
                  
                  <View style={{flexDirection: 'row', 
                      justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Text style={styles.cardTitle}>报告时间撒撒旦撒旦</Text>
                      <Text style={styles.cartDesc}>2025-10-13 18:00:00</Text>
                  </View>
                  <View style={{flexDirection: 'row', 
                      justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Text style={styles.cardTitle}>施工地点</Text>
                      <Text style={styles.cartDesc}>江苏省泰州市姜堰区地静兰玩的单身；阿萨阿萨实打实大苏打</Text>
                  </View>
                  
              </View>
              <Icon source="chevron-right" size={24} />
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  cardTitle: {
    flexBasis: 80, 
    flexGrow: 0, 
    flexShrink: 0
  },
  cartDesc: {
    flexBasis: 'auto', 
    flexGrow: 1, 
    flexShrink: 1,
    marginLeft: 20
  }
})