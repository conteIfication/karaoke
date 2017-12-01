package pl.desput.smartkaraoke;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

public class AppSingleton {
    private static AppSingleton appSingletonInstance;
    private RequestQueue requestQueue;
    private static Context context;

    private AppSingleton(Context context) {
        AppSingleton.context = context;
        requestQueue = getRequestQueue();
    }

    public static synchronized AppSingleton getInstance(Context context) {
        if (appSingletonInstance == null) {
            appSingletonInstance = new AppSingleton(context);
        }
        return appSingletonInstance;
    }

    public RequestQueue getRequestQueue() {
        if (this.requestQueue == null) {
            requestQueue = Volley.newRequestQueue(AppSingleton.context.getApplicationContext());
        }
        return requestQueue;
    }

    public <T> void addToRequestQueue(Request<T> req,String tag) {
        req.setTag(tag);
        getRequestQueue().add(req);
    }

    public void cancelPendingRequests(Object tag) {
        if (requestQueue != null) {
            requestQueue.cancelAll(tag);
        }
    }


}
