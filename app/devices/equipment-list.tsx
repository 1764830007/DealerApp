import CustomDrawer from "@/components/devices/CustomDrawer";
import EmptyDrawer, { Helpers } from "@/components/devices/EmptyDrawer";
import EquipmentCard from "@/components/devices/equipment-card";
import { useLocalization } from "@/hooks/locales/LanguageContext";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { Button, Icon, Searchbar, SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EquipmentManageList() {
  const { t } = useLocalization();
  const router = useRouter();
  const [filterActive, setFilterActive] = useState(false);
  const [equipSearchField, setEquipmentSearchField] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  
  const [dealerText, setDealerText] = useState('search');
  // const tabs = [
  //   { value: "all", label: "全部"},
  //   { value: "online", label: "已连接" },
  //   { value: "offline", label: "未连接"},
  // ];

 const EquipSearch = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* 点击经销商，打开侧边栏，选择经销商，点击确认 */}
      <EmptyDrawer drawerContent={ (helpers: Helpers) => (
        <>
          <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
            <Ionicons name="search-outline" size={24} color="black" />
            <TextInput value={dealerText} onChangeText={setDealerText} />
            <GestureDetector gesture={helpers.closeDrawer}>
              <Button>confirm</Button>
            </GestureDetector>
          </View>
        </>
        ) } >
        {(helpers: Helpers) => (  
          <>
            <Text style={{ paddingHorizontal: 10 }}>经销商</Text>
            <GestureDetector gesture={helpers.openDrawer}>
            <TouchableOpacity
              style={{
                paddingLeft: 20, paddingRight: 10,
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
              }}>
              <Text>{dealerText}</Text>
              <Icon source="chevron-right" size={20} />
            </TouchableOpacity>
            </GestureDetector>
          </>
        ) }
      </EmptyDrawer>
    </SafeAreaView>
  );
 };

  return (
    <CustomDrawer drawerContent={() => <EquipSearch /> } title={t("equipment.list") }>
      <View style={styles.container}>
        {/* search bar */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Searchbar
            placeholder="please search serialNos"
            placeholderTextColor="grey"
            onChangeText={setEquipmentSearchField}
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 15,
              marginTop: 10,
              height: 36,
            }}
            inputStyle={{ minHeight: 0, fontSize: 14 }}
            value={equipSearchField}
          ></Searchbar>
          <Icon source="map-check" size={24} />
        </View>
        {/* 设备数，在线数，离线 */}
        <View
          style={{
            marginTop: 15,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            {/* 设备数 */}
            <View
              style={{ flexDirection: "column", alignItems: "center", gap: 4 }}
            >
              <Text>11</Text>
              <Text>{t("equipment.count")}</Text>
            </View>
            {/* 在线数 */}
            <View
              style={{ flexDirection: "column", alignItems: "center", gap: 4 }}
            >
              <Text>0</Text>
              <Text>{t("equipment.online")}</Text>
            </View>
            {/* 离线数 */}
            <View
              style={{ flexDirection: "column", alignItems: "center", gap: 4 }}
            >
              <Text>4</Text>
              <Text>{t("equipment.offline")}</Text>
            </View>
          </View>
          <View style={{ backgroundColor: "#f8fbff", flexDirection: "row" }}>
            <Feather
              name="alert-circle"
              size={18}
              color="grey"
              style={{ marginLeft: 10 }}
            />
            <Text
              style={{
                marginLeft: 10,
                color: "grey",
                fontSize: 12,
                alignSelf: "center",
              }}
            >
              在线离线盒子不支持PL241/243盒子
            </Text>
          </View>
        </View>
        {/* 全部，已连接，为连接 tabs */}
        <View style={{marginTop: 20}}>
          <SegmentedButtons
            theme={{ colors: { secondaryContainer: 'white' } }} 
            style={{borderRadius: 10, backgroundColor: '#e3e3e3'}}
            value={selectedTab}
            onValueChange={setSelectedTab}
            buttons={[
              { value: "all", label: "全部", uncheckedColor: 'grey', style: {...styles.Tab, ...styles.leftTab } },
              { value: "online", label: "已连接", uncheckedColor: 'grey',  style: styles.Tab },
              { value: "offline", label: "未连接",uncheckedColor: 'grey', style: {...styles.Tab, ...styles.rightTab }  }
            ]}
          />
           {selectedTab === 'all' && 
            (<EquipmentCard /> )
           }
           {selectedTab === 'online' && 
            (<View>
              <Text>online screen</Text>
            </View>)
           }
           {selectedTab === 'offline' && 
            (<View>
              <Text>offline screen</Text>
            </View>)
           }
        </View>
      </View>
    </CustomDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 15
  },
  bar: {
    backgroundColor: "#f6f6f6",
    boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
  },
  Tab: {
   borderRadius: 10,
   borderWidth: 0,
   marginVertical: 2,
   marginHorizontal: 2
  },
  leftTab: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  rightTab: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  }
});
