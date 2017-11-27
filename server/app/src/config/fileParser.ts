import { interfaces } from 'inversify'
import SpecialCharsRemover from '../services/SpecialCharsRemover'
import { FileParser } from '../services/FileParser'

export function fileParser(context: interfaces.Context) {
  const fileParser = new FileParser(context.container.get<SpecialCharsRemover>('specialCharsRemover'))

  return fileParser
}