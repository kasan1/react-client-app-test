import * as yup from 'yup';

const SUPPORTED_FORMATS = [
  'csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

export default yup.object().shape({
  typeId: yup.string().required('Выберите тип'),
  file: yup
    .mixed()
    .required('Прикрепите файл')
    .test('fileType', 'Тип файла не поддерживается', (value) =>
      SUPPORTED_FORMATS.includes(value?.type),
    ),
});
