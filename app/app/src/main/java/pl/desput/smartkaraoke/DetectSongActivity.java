package pl.desput.smartkaraoke;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.net.ConnectivityManager;
import android.net.Network;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.wearable.activity.WearableActivity;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

import java.util.Date;
import java.util.List;

import pl.desput.smartkaraoke.model.Song;

public class DetectSongActivity extends WearableActivity {

    private ImageButton runRecognizerButton;
    private ProgressBar progressBarListening;
    private TextView textViewStartSinging;
    private Context context;
    private Intent recognizerIntent;
    private boolean isListening;
    private int recordingPermission;
    private int internetPermission;
    private Date beginningOfListening;
    ProgressDialog progressDialog;
    String baseUrl = "http://kdesput.pl/songs?lyrics=";


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        context = this.getApplicationContext();
        setContentView(R.layout.activity_detect_song);
        this.isListening = false;
        progressDialog = new ProgressDialog(this);
        runRecognizerButton = findViewById(R.id.runRecognizerButton);
        progressBarListening = findViewById(R.id.progressBarListening);
        progressBarListening.animate();
        textViewStartSinging = findViewById(R.id.textViewStartSinging);

        runRecognizerButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                askForPermissions();
                displaySpeechRecognizer();
            }
        });

        // Enables Always-on
        setAmbientEnabled();
    }

    private void askForPermissions() {
        if (ContextCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.RECORD_AUDIO},
                    recordingPermission);
        }
        if (ContextCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.INTERNET) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.INTERNET},
                    internetPermission);
        }
    }

    public void volleyJsonRequest(String lyrics){

        String  REQUEST_TAG = "pl.desput.smartkaraoke.volleyJsonRequest";
        progressDialog.setMessage("Wyszukiwanie piosenki...");
        progressDialog.show();

        String url = baseUrl + lyrics.toLowerCase();

        JsonObjectRequest jsonObjectReq = new JsonObjectRequest(url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        progressDialog.hide();
                        Song song = new Song(response);
                        Toast toast = Toast.makeText(
                                context,
                                song.getArtist() + " - " + song.getTitle(),
                                Toast.LENGTH_SHORT
                        );
                        toast.show();
                        Bundle bundle = new Bundle();
                        bundle.putSerializable("SONG", song);
                        bundle.putSerializable("START_TIME", beginningOfListening);
                        Intent intent = new Intent(getBaseContext(), DisplayTextActivity.class);
                        intent.putExtras(bundle);
                        startActivity(intent);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                progressDialog.hide();
                String toastText;
                if ( error.networkResponse.statusCode == 400) {
                    toastText = "Piosenka nie została znaleziona";
                } else {
                    toastText = "Problem z połączeniem internetowym";
                }
                Toast toast = Toast.makeText(context, toastText, Toast.LENGTH_SHORT);
                toast.show();
            }
        });

        // Adding JsonObject request to request queue
        AppSingleton.getInstance(getApplicationContext()).addToRequestQueue(jsonObjectReq,REQUEST_TAG);
    }

    private void displaySpeechRecognizer() {
        SpeechRecognizer sr = SpeechRecognizer.createSpeechRecognizer(context);
        sr.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle params) {
                changeLayoutToListening();
            }

            @Override
            public void onBeginningOfSpeech() {
                beginningOfListening = new Date();
            }

            @Override
            public void onRmsChanged(float rmsdB) {
            }

            @Override
            public void onBufferReceived(byte[] buffer) {
            }

            @Override
            public void onEndOfSpeech() {
            }

            @Override
            public void onError(int error) {
                changeLayoutToIdle();
            }

            @Override
            public void onResults(Bundle results) {
                changeLayoutToIdle();
                String result = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION).get(0);
                volleyJsonRequest(result);
            }

            @Override
            public void onPartialResults(Bundle partialResults) {
            }

            @Override
            public void onEvent(int eventType, Bundle params) {
            }
        });
            runRecognizerButton.setVisibility(View.INVISIBLE);
            recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "pl-PL");
            recognizerIntent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, getApplication().getPackageName());
            recognizerIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);

        try {
            sr.startListening(recognizerIntent);
        } catch (Exception e) {
            Toast toast2 = Toast.makeText(context, e.getMessage(), Toast.LENGTH_SHORT);
            toast2.show();
        }
    }

    private void changeLayoutToListening() {
        this.isListening = true;
        runRecognizerButton.setVisibility(View.INVISIBLE);
        progressBarListening.setVisibility(View.VISIBLE);
        textViewStartSinging.setVisibility(View.VISIBLE);
    }

    private void changeLayoutToIdle() {
        this.isListening = false;
        runRecognizerButton.setVisibility(View.VISIBLE);
        progressBarListening.setVisibility(View.INVISIBLE);
        textViewStartSinging.setVisibility(View.INVISIBLE);
    }
}
