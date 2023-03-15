import * as yup from 'yup';

export default yup.object().shape({
  firstName: yup
    .string()
    .max(50, 'Длина строки не должно превышать 50 символов')
    .required("Поле 'Фамилия' обязательное для заполнения"),
  lastName: yup
    .string()
    .max(50, 'Длина строки не должно превышать 50 символов')
    .required("Поле 'Имя' обязательное для заполнения"),
  middleName: yup
    .string()
    .max(50, 'Длина строки не должно превышать 50 символов')
    .required("Поле 'Отчество' обязательное для заполнения"),
  birthDate: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .min(new Date(1900, 0, 1), 'Минимальное значение 01.01.1900')
    .max(new Date(), 'Нельзя выбирать день из будущего')
    .required("Поле 'Дата рождения' обязательное для заполнения"),
  email: yup
    .string()
    .nullable()
    .email('Формат не соответствует электронной почте')
    .max(50, 'Длина строки не должно превышать 50 символов'),
  phone: yup
    .string()
    .nullable()
    .max(20, 'Длина строки не должно превышать 20 символов'),
});
