"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button/Button";
import { fetchArticleById } from "@/features/articles/details/article-details.service";

import ArticleImagePreview from "../../../create/components/ArticleImagePreview/ArticleImagePreview";

import { editArticleSchema } from "../../edit-article.schema";
import { updateArticle } from "../../edit-article.service";
import type { EditArticleFormValues } from "../../edit-article.types";

import css from "./EditArticleForm.module.css";

type EditArticleFormProps = {
  articleId: string;
};

const EditArticleForm = ({ articleId }: EditArticleFormProps) => {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => fetchArticleById(articleId),
  });

  useEffect(() => {
    if (data?.article?.imageUrl) {
      setPreviewUrl(data.article.imageUrl);
    }
  }, [data?.article?.imageUrl]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: EditArticleFormValues) => updateArticle(articleId, values),

    onSuccess: () => {
      toast.success("Article updated successfully!");

      router.push(`/articles/${articleId}`);
      router.refresh();
    },

    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update article");
    },
  });

  if (isLoading) {
    return <p>Loading article...</p>;
  }

  if (isError || !data?.article) {
    return <p>Failed to load article.</p>;
  }

  const initialValues: EditArticleFormValues = {
    title: data.article.title,
    article: data.article.article,
    publicationDate: data.article.publicationDate.slice(0, 10),
    image: null,
  };

  const handleImageChange = (
    file: File | null,
    setFieldValue: (field: string, value: unknown) => void,
  ) => {
    setFieldValue("image", file);

    if (!file) {
      setPreviewUrl(data.article.imageUrl ?? "");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (values: EditArticleFormValues) => {
    await mutateAsync(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={editArticleSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue, errors, touched, values }) => (
        <Form className={css.form}>
          {/* IMAGE */}

          <div className={css.imageField}>
            <ArticleImagePreview
              previewUrl={previewUrl}
              onChange={(file) => handleImageChange(file, setFieldValue)}
              error={touched.image && errors.image ? String(errors.image) : undefined}
            />
          </div>

          {/* TITLE */}

          <div className={css.titleField}>
            <label htmlFor="title" className={css.label}>
              {values.title ? "Article Title" : "Title"}
            </label>

            <div
              className={`${css.inputWrapper} ${
                touched.title && errors.title ? css.errorState : values.title ? css.filledState : ""
              }`}
            >
              <Field
                id="title"
                name="title"
                type="text"
                placeholder="Enter the title"
                className={css.input}
              />
            </div>

            <ErrorMessage name="title" component="p" className={css.error} />
          </div>

          {/* ARTICLE */}

          <div className={css.descriptionField}>
            <div
              className={`${css.textareaWrapper} ${
                touched.article && errors.article
                  ? css.errorState
                  : values.article
                    ? css.filledState
                    : ""
              }`}
            >
              <Field
                as="textarea"
                id="article"
                name="article"
                placeholder="Enter a text"
                className={css.textarea}
              />
            </div>

            <ErrorMessage name="article" component="p" className={css.error} />
          </div>

          {/* SUBMIT */}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className={css.submitButton}
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? "Saving..." : "Save changes"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditArticleForm;
