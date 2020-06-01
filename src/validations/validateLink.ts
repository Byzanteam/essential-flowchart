import { IState, INewLink, ILink } from '@/types';

export default function validateLink (link: INewLink | ILink, state: IState): boolean {
  const { linkValidations } = state.config;
  let isValid = true;

  if (Array.isArray(linkValidations)) {
    let index = 0;

    while (isValid && index < linkValidations.length) {
      const linkValidation = linkValidations[index];
      isValid = linkValidation(link, state.graph);
      index += 1;
    }
  }

  return isValid;
}
