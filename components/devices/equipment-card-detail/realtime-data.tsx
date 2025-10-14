import WebView from "react-native-webview";

export default function RealTimeData() {
    return (
        <WebView style={{flex: 1}} source={ {uri: 'https://www.bilibili.com'} } />
    );
}