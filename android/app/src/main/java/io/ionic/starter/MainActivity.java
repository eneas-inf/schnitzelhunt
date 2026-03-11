package io.ionic.starter;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";

    @Override
    public void onStart() {
        super.onStart();
        checkForApiKey();
    }

    private void checkForApiKey() {
        try {
            ApplicationInfo appInfo = getPackageManager().getApplicationInfo(
                    getPackageName(),
                    PackageManager.GET_META_DATA
            );

            Bundle bundle = appInfo.metaData;
            String apiKey = bundle != null ? bundle.getString("com.google.android.geo.API_KEY") : null;
            Log.d(TAG, "Google Maps API key present: " + (apiKey != null && !apiKey.isEmpty()));
        } catch (Exception e) {
            Log.e(TAG, "Unable to read application metadata", e);
        }
    }
}
