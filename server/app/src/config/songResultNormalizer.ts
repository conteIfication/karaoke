import { interfaces } from 'inversify'
import SpecialCharsRemover from '../services/SpecialCharsRemover'
import { SongResultNormalizer } from '../services/SongResultNormalizer'

export function songResultNormalizer(context: interfaces.Context) {
  const songResultNormalizer = new SongResultNormalizer(context.container.get<SpecialCharsRemover>('specialCharsRemover'))

  return songResultNormalizer
}