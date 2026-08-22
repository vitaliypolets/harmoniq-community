'use client';

 import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/store/auth.store';
import { useArticleDraftStore } from '@/store/articleDraftStore';

import { createArticleSchema } from '../../create-article.schema';
import { createArticle } from '../../create-article.service';
import type { CreateArticleFormValues } from '../../create-article.types';

import Button from '@/components/ui/Button/Button';
import ArticleImagePreview from '../ArticleImagePreview/ArticleImagePreview';

import css from './AddArticleForm.module.css';

const getCurrentDate = (): string => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const AddArticleForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const userId = useAuthStore((state) => state.user?.id);

  const { draft, setDraft, clearDraft } =
    useArticleDraftStore();

  const [previewUrl, setPreviewUrl] = useState('');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createArticle,

    onSuccess: article => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: ['profile', 'my-articles', userId],
        });
      }

      clearDraft();
      setPreviewUrl('');
      toast.success('Article created successfully!');
      router.push(`/articles/${article.id}`);
    },

    onError: error => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create article',
      );
    },
  });

  const handleImageChange = (
    file: File | null,
    setFieldValue: (
      field: string,
      value: unknown,
    ) => void,
  ) => {
    setFieldValue('image', file);

    if (!file) {
      setPreviewUrl('');
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (
    values: CreateArticleFormValues,
  ) => {
    await mutateAsync(values);
  };

  return (
    <Formik
      initialValues={{
        title: draft.title,
        article: draft.article,
        image: null,
        publicationDate: getCurrentDate(),
      }}
      validationSchema={createArticleSchema}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        setFieldValue,
        errors,
        touched,
        values,
      }) => (
        <Form className={css.form}>
          {/* IMAGE */}

          <div className={css.imageField}>
            <ArticleImagePreview
              previewUrl={previewUrl}
              onChange={file =>
                handleImageChange(file, setFieldValue)
              }
              error={
                touched.image && errors.image
                  ? String(errors.image)
                  : undefined
              }
            />
          </div>

          {/* TITLE */}

          <div className={css.titleField}>
            <label
              htmlFor="title"
              className={css.label}
            >
              {values.title ? 'Article Title' : 'Title'}
            </label>

            <div
              className={`${css.inputWrapper} ${
                touched.title && errors.title
                  ? css.errorState
                  : values.title
                    ? css.filledState
                    : ''
              }`}
            >
              <Field
                id="title"
                name="title"
                type="text"
                placeholder="Enter the title"
                className={css.input}
                onChange={(
                  event: React.ChangeEvent<HTMLInputElement>,
                ) => {
                  const value = event.target.value;

                  setFieldValue('title', value);

                  setDraft({
                    ...draft,
                    title: value,
                  });
                }}
              />
            </div>

            <ErrorMessage
              name="title"
              component="p"
              className={css.error}
            />
          </div>

          {/* ARTICLE */}

          <div className={css.descriptionField}>
            <div
              className={`${css.textareaWrapper} ${
                touched.article && errors.article
                  ? css.errorState
                  : values.article
                    ? css.filledState
                    : ''
              }`}
            >
              <Field
                as="textarea"
                id="article"
                name="article"
                placeholder="Enter a text"
                className={css.textarea}
                onChange={(
                  event: React.ChangeEvent<HTMLTextAreaElement>,
                ) => {
                  const value = event.target.value;

                  setFieldValue('article', value);

                  setDraft({
                    ...draft,
                    article: value,
                  });

                  event.target.style.height = 'auto';
                  event.target.style.height = `${event.target.scrollHeight}px`;
                }}
              />
            </div>

            <ErrorMessage
              name="article"
              component="p"
              className={css.error}
            />
          </div>

          {/* SUBMIT */}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className={css.submitButton}
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending
              ? 'Publishing...'
              : 'Publish Article'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddArticleForm;
