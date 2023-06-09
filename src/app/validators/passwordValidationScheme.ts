import * as yup from 'yup';

export default yup.object().shape({
  oldPassword: yup
    .string()
    .min(6, 'Минимальное количество символов для пароля 6')
    .max(50, 'Пароль не может быть больше чем 50 символов')
    .required('Введите текущий пароль'),
  newPassword: yup
    .string()
    .min(6, 'Минимальное количество символов для пароля 6')
    .max(50, 'Пароль не может быть больше чем 50 символов')
    .required('Введите новый пароль'),
  confirmedNewPassword: yup
    .string()
    .min(6, 'Минимальное количество символов для пароля 6')
    .max(50, 'Пароль не может быть больше чем 50 символов')
    .required('Введите новый пароль еще раз'),
});
