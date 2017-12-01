package pl.desput.smartkaraoke.model;

import android.widget.ProgressBar;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONObject;

public class Song implements Serializable {
    private String title;
    private String artist;
    private String language;
    private String genre;
    private String creator;
    private double bpm;
    private int gap;
    private ArrayList<Line> lines;
    private String fullText;
    private int firstSyllablePosition;

    public Song(JSONObject jsonObject) {
        try {
            this.lines = new ArrayList<Line>(generateLines(jsonObject.getJSONArray("lyrics")));
            if(jsonObject.has("bpm")) {
                this.bpm = jsonObject.getDouble("bpm");
            }
            if(jsonObject.has("firstSyllablePosition")) {
                this.firstSyllablePosition = jsonObject.getInt("firstSyllablePosition");
            }
            if(jsonObject.has("fullText")) {
                this.fullText = jsonObject.getString("fullText");
            }
            if(jsonObject.has("title")) {
                this.title = jsonObject.getString("title");
            }
            if(jsonObject.has("artist")) {
                this.artist = jsonObject.getString("artist");
            }
            if(jsonObject.has("language")) {
                this.language = jsonObject.getString("language");
            }
            if(jsonObject.has("genre")) {
                this.genre = jsonObject.getString("genre");
            }
            if(jsonObject.has("creator")) {
                this.creator = jsonObject.getString("creator");
            }
            if(jsonObject.has("gap")) {
                this.gap = jsonObject.getInt("gap");
            }
        } catch (Exception e) {

        }
    }

    public int calculateFirstDisplayedLine(Date beginningOfListening, Date startingOfDisplaying) {
        long gapInSeconds = (startingOfDisplaying.getTime() - beginningOfListening.getTime())/1000;
        double gapInBeats = bpm / 60 * gapInSeconds;

        int calculatedPosition = firstSyllablePosition + (int) gapInBeats; //2043
        int i = 0;

        int returnedLinePosition = 0;
        while (i < lines.size()) {
            if(lines.get(i).getPosition() <= calculatedPosition && lines.get(i).getPosition() > returnedLinePosition) {
                returnedLinePosition = lines.get(i).getPosition();
            }
            i++;
        }

        return returnedLinePosition;
    }

    private ArrayList<Line> generateLines(JSONArray lyrics) {
        ArrayList<Line> lines = new ArrayList<Line>();

            ArrayList<Syllable> syllablesBuffer = new ArrayList<Syllable>();
            for(int n = 0; n < lyrics.length(); n++) {
                String note, text;
                int position = 0, length = 0, pitch;
                try {
                    JSONObject object = lyrics.getJSONObject(n);
                    note = object.getString("note");
                    position = object.getInt("position");
                    if (object.has("length")) {
                        length = object.getInt("length");
                    } else {
                        length = 0;
                    }
                    if (object.has("text")) {
                        text = object.getString("text");
                    } else {
                        text = "";
                    }
                    if (object.has("pitch")) {
                        pitch = object.getInt("pitch");
                    } else {
                        pitch = 0;
                    }
                    Syllable syllable = new Syllable(note, position, length, pitch, text);
                    if (note.equals("-")) {
                        lines.add(new Line((ArrayList<Syllable>)syllablesBuffer.clone()));
                        syllablesBuffer.clear();
                    }
                    syllablesBuffer.add(syllable);
                } catch (Exception e) {
                }
            }
            lines.add(new Line(syllablesBuffer));
        lines.sort(new Comparator<Line>() {
            @Override
            public int compare(Line o1, Line o2) {
                return o1.getPosition() < o2.getPosition() ? -1 : 1;
            }
        });

        return lines;
    }

    public String getTextForPosition(int position) {
        String returnedText = "";
        int returnedLinePosition = 0;
        int i = 0;
        while (i < lines.size()) {
            if(lines.get(i).getPosition() <= position && lines.get(i).getPosition() > returnedLinePosition) {
                returnedLinePosition = lines.get(i).getPosition();
                returnedText = lines.get(i).getText();
            }
            i++;
        }

        return returnedText;
    }

    public String getTitle() {
        return this.title;
    }

    public String getArtist() {
        return this.artist;
    }

    public String getLanguage() {
        return this.language;
    }

    public String getGenre() {
        return this.genre;
    }

    public String getCreator() {
        return this.creator;
    }

    public double getBpm() {
        return this.bpm;
    }

    public int getGap() {
        return this.gap;
    }

    public ArrayList<Line> getLines() {
        return this.lines;
    }

    public String getFullText() {
        return this.fullText;
    }

    public int getFirstSyllablePosition() {
        return this.firstSyllablePosition;
    }
}


