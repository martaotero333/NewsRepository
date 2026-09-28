import type { DataRepository } from './data-repository';
import type { AddSourceInput } from '../../shared/models/types';
import { validateSource } from '../../shared/models/validation';

export function addSource(repository: DataRepository, input: AddSourceInput) {
  const error = validateSource(input);
  if (error) throw new Error(error);
  return repository.addSource(input);
}
