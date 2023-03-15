import * as yup from 'yup';

export default yup.object().shape({
  identifier: yup.string().required('Укажите ИИН/БИН тип'),
  dateFrom: yup.date().nullable().required('Укажите начало периода'),
  dateTo: yup.date().nullable().required('Укажите конец периода'),
});
