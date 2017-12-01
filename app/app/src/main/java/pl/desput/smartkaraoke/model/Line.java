package pl.desput.smartkaraoke.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Comparator;

public class Line implements Serializable {
    private ArrayList<Syllable> syllables;

    public Line(ArrayList<Syllable> syllables) {
        this.syllables = syllables;
        this.syllables.sort(new Comparator<Syllable>() {
           @Override
           public int compare(Syllable o1, Syllable o2) {
               return o1.getPosition() < o2.getPosition() ? -1 : 1;
           }
        });
    }

    public int getPosition() {
        return syllables.get(0).getPosition();
    }

    public int getLength() {
        return syllables.get(syllables.size() - 1).getPosition() - syllables.get(0).getPosition() + syllables.get(syllables.size() - 1).getLength();
    }

    public String getText() {
        String returnedText = "";
        for(Syllable syllable : syllables) {
            returnedText += syllable.getText();
        }

        return returnedText;
    }
}
