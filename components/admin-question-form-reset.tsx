'use client';

import { useEffect } from 'react';

export default function AdminQuestionFormReset({
  formId,
}: {
  formId: string;
}) {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>(`form[data-question-form-id="${formId}"]`);
    if (!form) {
      return;
    }

    const answerField = form.elements.namedItem('answer') as HTMLTextAreaElement | null;
    const answerAuthorField = form.elements.namedItem('answerAuthor') as HTMLInputElement | null;

    if (answerField) {
      answerField.value = '';
    }

    if (answerAuthorField) {
      answerAuthorField.value = '';
    }
  }, [formId]);

  return null;
}
