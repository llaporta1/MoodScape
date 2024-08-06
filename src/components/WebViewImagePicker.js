import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
console.log(WebView);

const WebViewImagePicker = ({ onImagePicked }) => {
  const webViewRef = useRef(null);

  const handleImageUpload = (event) => {
    const { data } = event.nativeEvent;
    if (data.startsWith('data:image')) {
      onImagePicked(data);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webview}
        originWhitelist={['*']}
        onMessage={handleImageUpload}
        source={{
          html: `
            <!DOCTYPE html>
            <html>
              <body>
                <input type="file" accept="image/*" onchange="handleFileChange(event)" />
                <script>
                  function handleFileChange(event) {
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.onload = function(event) {
                      window.ReactNativeWebView.postMessage(event.target.result);
                    };
                    reader.readAsDataURL(file);
                  }
                </script>
              </body>
            </html>
          `,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default WebViewImagePicker;
