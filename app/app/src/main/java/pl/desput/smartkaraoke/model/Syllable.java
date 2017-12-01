package pl.desput.smartkaraoke.model;

import org.json.JSONObject;
import java.io.Serializable;

public class Syllable implements Serializable {
    private String note;
    private int position;
    private int length;
    private int pitch;
    private String text;

    public Syllable(JSONObject syllable) {
        try {
            note = syllable.getString("note");
            position = syllable.getInt("position");
            length = syllable.getInt("length");
            pitch = syllable.getInt("pitch");
            text = syllable.getString("text");
            if(text.isEmpty()) text = " ";
        } catch (Exception e) {
            System.out.println("Exception while creating syllable");
        }
    }

    public Syllable(String note, int position, int length, int pitch, String text) {
        this.note = note;
        this.position = position;
        this.length = length;
        this.pitch = pitch;
        this.text = text;
    }

    public String getNote() {
        return note;
    }

    public int getPosition() {
        return position;
    }

    public int getLength() {
        return length;
    }

    public String getText() {
        return text;
    }
}
