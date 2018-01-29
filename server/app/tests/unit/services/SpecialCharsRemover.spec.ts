import 'reflect-metadata'
import { expect } from 'chai'
import SpecialCharsRemover from '../../../src/services/SpecialCharsRemover'

describe('Unit: SpecialCharsRemover', () => {

    it('should remove special chars from string', () => {

        const specialCharsRemover = new SpecialCharsRemover()
        const stringWithoutSpecialChars = specialCharsRemover.removeSpecialChars('Fgfd  sdg. sdfh?? fhd: fd, d!!!')

        expect(stringWithoutSpecialChars).to.be.equal('fgfdsdgsdfhfhdfdd')
    })

    it('should return empty string if there is no string given', () => {
        const specialCharsRemover = new SpecialCharsRemover()
        const stringWithoutSpecialChars = specialCharsRemover.removeSpecialChars(undefined)

        expect(stringWithoutSpecialChars).to.be.equal('')
    })
})