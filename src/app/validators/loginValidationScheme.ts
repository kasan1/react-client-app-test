import * as yup from 'yup';

export default yup.object().shape({
  login: yup
    .string()
    .length(12, 'ИИН должен состоять ровно из 12 цифр')
    .required('Введите логин (ИИН)'),
  password: yup.string().required('Введите пароль'),
});
