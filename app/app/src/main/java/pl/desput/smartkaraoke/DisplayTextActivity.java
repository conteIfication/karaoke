package pl.desput.smartkaraoke;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.SystemClock;
import android.support.wearable.activity.WearableActivity;
import android.widget.Chronometer;
import android.widget.TextView;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import pl.desput.smartkaraoke.model.Song;

public class DisplayTextActivity extends WearableActivity {

    private TextView mTextView;
    private Date beginningOfListening;
    private Song song;
    private int currentPosition;
    private int beginningPosition;
    private CountDownTimer timer;

    private static final String AMBIENT_UPDATE_ACTION = "com.your.package.action.AMBIENT_UPDATE";

    private AlarmManager mAmbientStateAlarmManager;
    private PendingIntent mAmbientStatePendingIntent;
    private BroadcastReceiver mAmbientUpdateBroadcastReceiver;
    private static final long AMBIENT_INTERVAL_MS = TimeUnit.SECONDS.toMillis(1);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent intent = getIntent();
        Bundle bundle = intent.getExtras();
        beginningOfListening = (Date) bundle.getSerializable("START_TIME");
        song = (Song) bundle.getSerializable("SONG");

        currentPosition = song.calculateFirstDisplayedLine(beginningOfListening, new Date());
        beginningPosition = currentPosition;
        setContentView(R.layout.activity_display_text);

        mTextView = findViewById(R.id.text);

        timer = new CountDownTimer(3600* 1000, 200) {

            public void onTick(long millisUntilFinished) {
                long miliSeconds = 3600 * 1000 - millisUntilFinished;
                calculateCurrentPosition(miliSeconds);

                mTextView.setText(song.getTextForPosition(currentPosition));
            }

            public void onFinish() {}

        };

        timer.start();

        // Enables Always-on
        setAmbientEnabled();

        mAmbientStateAlarmManager =
                (AlarmManager) getSystemService(Context.ALARM_SERVICE);

        Intent ambientUpdateIntent = new Intent(AMBIENT_UPDATE_ACTION);

        mAmbientStatePendingIntent = PendingIntent.getBroadcast(
                this, 0, ambientUpdateIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        mAmbientUpdateBroadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                refreshDisplayAndSetNextUpdate();
            }
        };
    }

    private void calculateCurrentPosition(long miliSeconds) {
        this.currentPosition = beginningPosition + (int) (miliSeconds * (song.getBpm() / 15000));
    }

    @Override
    public void onResume() {
        super.onResume();
        IntentFilter filter = new IntentFilter(AMBIENT_UPDATE_ACTION);
        registerReceiver(mAmbientUpdateBroadcastReceiver, filter);
    }

    @Override
    public void onPause() {
        super.onPause();
        unregisterReceiver(mAmbientUpdateBroadcastReceiver);
        mAmbientStateAlarmManager.cancel(mAmbientStatePendingIntent);
    }

    private void refreshDisplayAndSetNextUpdate() {
        if (isAmbient()) {
            // Implement data retrieval and update the screen for ambient mode
        } else {
            // Implement data retrieval and update the screen for interactive mode
        }
        long timeMs = System.currentTimeMillis();
        // Schedule a new alarm
        if (isAmbient()) {
            // Calculate the next trigger time
            long delayMs = AMBIENT_INTERVAL_MS - (timeMs % AMBIENT_INTERVAL_MS);
            long triggerTimeMs = timeMs + delayMs;
            this.mAmbientStateAlarmManager.setExact(
                    AlarmManager.RTC_WAKEUP,
                    triggerTimeMs,
                    mAmbientStatePendingIntent);
        } else {
            // Calculate the next trigger time for interactive mode
        }
    }

    @Override
    public void onEnterAmbient(Bundle ambientDetails) {
        super.onEnterAmbient(ambientDetails);
        refreshDisplayAndSetNextUpdate();
    }

    @Override
    public void onUpdateAmbient() {
        super.onUpdateAmbient();
        refreshDisplayAndSetNextUpdate();
    }

    @Override
    public void onExitAmbient() {
        super.onExitAmbient();
        mAmbientStateAlarmManager.cancel(mAmbientStatePendingIntent);
    }

    @Override
    public void onDestroy() {
        mAmbientStateAlarmManager.cancel(mAmbientStatePendingIntent);
        super.onDestroy();
    }



}
