import { injectable } from 'inversify'

@injectable()
export default class SpecialCharsRemover {

    public removeSpecialChars(text: string) {
        if (!text) return ''
        return text.toLowerCase()
            .replace(/ /g, '')
            .replace(/,/g, '')
            .replace(/\./g, '')
            .replace(/\?/g, '')
            .replace(/!/g, '')
            .replace(/:/g, '')
    }
}
