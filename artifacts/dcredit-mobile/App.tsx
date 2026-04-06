import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import type {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
} from "react-native-webview/lib/WebViewTypes";

const IOS_DEFAULT_URL = "http://127.0.0.1:5173";
const ANDROID_DEFAULT_URL = "http://10.0.2.2:5173";

type LoadError = {
  title: string;
  detail: string;
};

function getWebAppUrl() {
  return process.env.EXPO_PUBLIC_WEB_APP_URL ?? IOS_DEFAULT_URL;
}

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [loadError, setLoadError] = useState<LoadError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const webAppUrl = useMemo(() => getWebAppUrl(), []);
  const helpText = useMemo(() => {
    if (webAppUrl.includes("127.0.0.1")) {
      return "Start the Vite app with PORT=5173 BASE_PATH=/ pnpm --filter @workspace/dcredit dev, then retry.";
    }

    if (webAppUrl.includes(ANDROID_DEFAULT_URL)) {
      return "Start the Vite app locally and confirm the Android emulator can reach 10.0.2.2:5173, then retry.";
    }

    return `Confirm the hosted web app is reachable at ${webAppUrl}, then retry.`;
  }, [webAppUrl]);

  const retry = useCallback(() => {
    setLoadError(null);
    setIsLoading(true);
    setReloadCount((value) => value + 1);
    webViewRef.current?.reload();
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback((event: WebViewErrorEvent) => {
    const description = event.nativeEvent.description?.trim();
    setIsLoading(false);
    setLoadError({
      title: "Unable to load dCredit",
      detail:
        description && description.length > 0
          ? `${description}. ${helpText}`
          : helpText,
    });
  }, [helpText]);

  const handleHttpError = useCallback((event: WebViewHttpErrorEvent) => {
    setIsLoading(false);
    setLoadError({
      title: "Unable to load dCredit",
      detail: `HTTP ${event.nativeEvent.statusCode}. ${helpText}`,
    });
  }, [helpText]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loadError ? (
          <View style={styles.centered}>
            <Text style={styles.title}>{loadError.title}</Text>
            <Text style={styles.message}>{loadError.detail}</Text>
            <Text style={styles.code}>{webAppUrl}</Text>
            <Pressable onPress={retry} style={styles.button}>
              <Text style={styles.buttonText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <WebView
              key={reloadCount}
              ref={webViewRef}
              source={{ uri: webAppUrl }}
              originWhitelist={["*"]}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              onError={handleError}
              onHttpError={handleHttpError}
              startInLoadingState
              allowsBackForwardNavigationGestures
              renderLoading={() => (
                <View style={styles.centered}>
                  <ActivityIndicator size="large" color="#111827" />
                  <Text style={styles.message}>Loading dCredit…</Text>
                </View>
              )}
            />
            {isLoading ? (
              <View pointerEvents="none" style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color="#111827" />
              </View>
            ) : null}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4B5563",
    textAlign: "center",
  },
  code: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#111827",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});
