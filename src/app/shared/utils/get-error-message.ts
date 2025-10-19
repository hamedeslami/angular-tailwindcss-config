import { FormGroup } from '@angular/forms';

export function getErrorMessage(
  form: FormGroup,
  controlName: string,
  texts: Record<string, string | undefined>
): string {
  const control = form.get(controlName);
  if (!control || !control.errors) return '';

  if (control.errors['required']) {
    return texts[`required${capitalize(controlName)}`] ?? '';
  }

  if (control.errors['pattern']) {
    return texts[`invalid${capitalize(controlName)}`] ?? '';
  }

  return '';
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
