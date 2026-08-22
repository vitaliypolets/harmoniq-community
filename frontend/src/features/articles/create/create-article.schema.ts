// TODO: реалізувати відповідно до docs/OWNERSHIP_MAP.md
import * as Yup from 'yup';

const MAX_IMAGE_SIZE = 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const createArticleSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, 'Заголовок має містити щонайменше 3 символи')
    .max(48, 'Заголовок має містити не більше 48 символів')
    .required('Заголовок є обов’язковим'),

  article: Yup.string()
    .trim()
    .min(100, 'Стаття має містити щонайменше 100 символів')
    .max(4000, 'Стаття має містити не більше 4000 символів')
    .required('Текст статті є обов’язковим'),

  image: Yup.mixed<File>()
    .required('Зображення статті є обов’язковим')
    .test(
      'fileSize',
      'Розмір зображення не повинен перевищувати 1 МБ',
      value => {
        if (!value) return true;

        return value.size <= MAX_IMAGE_SIZE;
      },
    )
    .test(
      'fileType',
      'Дозволені лише зображення JPEG, PNG та WEBP',
      value => {
        if (!value) return true;

        return ALLOWED_IMAGE_TYPES.includes(value.type);
      },
    ),

  publicationDate: Yup.string()
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      'Дата має бути у форматі YYYY-MM-DD',
    )
    .required('Дата публікації є обов’язковою'),
});

