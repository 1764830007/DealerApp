import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { Text, View } from "react-native";
import { Button, Card, Chip } from "react-native-paper";

export default function EquipmentCard() {
  const router = useRouter();
  
  const goToFaultAlarm = () => {
    // 传递serialNumber参数，先写死为S6203227
    router.push({
      pathname: '/devices/equipment-fault-list',
      params: { serialNumber: 'SL702740' }
    });
  };
  return (
    <Card
      mode="contained"
      onPress={ () => router.push('/devices/equipment-list/12')}
      style={{ marginTop: 10, borderRadius: 5, backgroundColor: "#fff" }}
    >
      <Card.Title
        title="SEM660D / S6200604"
        titleStyle={{
          alignContent: "center",
          fontSize: 14,
          fontWeight: 500,
        }}
        style={{ backgroundColor: "#e4ebf3", minHeight: 40 }}
        // 机编号右边的按钮，请求服务
        right={() => (
        <Button mode="contained" 
            compact 
            buttonColor='#013b84'
            labelStyle={{fontSize: 12, fontWeight: 400, marginVertical: 2 }} 
            style={{borderRadius: 4 }}>
            request service
        </Button>)}
        rightStyle={{marginRight: 15 }}
      />
      <Card.Content>
        <View>
            {/* 通知 */}
            <View style={{backgroundColor: '#e4ebf3', borderRadius: 5, 
                flexDirection: 'row', alignItems: 'center',
                marginTop: 10, paddingVertical: 5 }}>
                <AntDesign name="notification" size={20} color="black" style={{paddingHorizontal: 10 }} />
                <Text style={{fontSize: 10, fontWeight: 300 }}>the next recommended period maintenance is 15555 hours</Text>
            </View>
            {/* 设备信息,图片，总工时，位置 */}
            <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 10 }}>
              <AntDesign name="car" size={48} color="black" style={{flexBasis: 60, flexGrow: 0, flexShrink: 0 }} />
              <View style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 10, height: 60, flexBasis: 50, flexGrow: 1, flexShrink: 1 }}>
                <Text style={{fontSize: 12, fontWeight: 300 }}>总工时：</Text>
                <Text style={{fontSize: 12, fontWeight: 300 }}>位置：</Text>
              </View>
              <View style={{flexDirection: 'column', justifyContent: 'flex-start', gap: 10, height: 60, flexBasis: 100, flexGrow: 2, flexShrink: 1 }}>
                <Text style={{fontSize: 12, fontWeight: 300 }}>10085.14</Text>
                <Text style={{fontSize: 12, fontWeight: 300 }}>广东省-梅州市-大埔县，X001 441.0米；下坑东</Text>
              </View>
            </View>
            {/* 在线离线状态，更新时间 */}
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip compact textStyle={{ fontSize: 12, fontWeight: 300, marginVertical: 3, paddingHorizontal: 5 }}
                    style={{backgroundColor: '#e3e3e3'}}>离线</Chip>
                <View style={{ alignItems: 'center', flexBasis: 50, flexGrow: 1, flexShrink: 1 }}>
                    <Text style={{fontSize: 12, fontWeight: 300 }}>更新时间：</Text>
                </View>
                <View style={{ flexBasis: 100, flexGrow: 2, flexShrink: 1 }}>
                    <Text style={{fontSize: 12, fontWeight: 300 }}>2025-09-12 07:30:18</Text>
                </View>
            </View>
            {/* 行车轨迹，故障报警，电子图册，服务手册 按钮 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <Button mode="contained" compact buttonColor='#f2f2f2' labelStyle={{fontSize: 12, fontWeight: 400, marginVertical: 2, color: '#083a78' }} style={{borderRadius: 4 }}>行车轨迹</Button>
                <Button mode="contained" onPress={goToFaultAlarm} compact buttonColor='#f2f2f2' labelStyle={{fontSize: 12, fontWeight: 400, marginVertical: 2, color: '#083a78' }} style={{borderRadius: 4 }}>故障报警</Button>
                <Button mode="contained" compact buttonColor='#f2f2f2' labelStyle={{fontSize: 12, fontWeight: 400, marginVertical: 2, color: '#083a78' }} style={{borderRadius: 4 }}>电子图册</Button>
                <Button mode="contained" compact buttonColor='#f2f2f2' labelStyle={{fontSize: 12, fontWeight: 400, marginVertical: 2, color: '#083a78' }} style={{borderRadius: 4 }}>服务手册</Button>
            </View>
        </View>
      </Card.Content>
    </Card>
  );
}
