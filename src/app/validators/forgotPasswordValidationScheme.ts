import * as yup from 'yup';

export default yup.object().shape({
  userName: yup
    .string()
    .length(12, 'ИИН должен состоять ровно из 12 цифр')
    .required('Введите логин (ИИН)'),
});
