import * as yup from 'yup';

export default yup.object().shape({
  identifier: yup
    .string()
    .length(12, 'ИИН должен состоять ровно из 12 чисел')
    .required('Введите ИИН'),
  firstName: yup.string().required('Введите имя'),
  lastName: yup.string().required('Введите фамилию'),
  middleName: yup.string(),
  email: yup
    .string()
    .email('Укажите валидный почтовый адрес')
    .required('Введите электронную почту'),
  branches: yup.array().of(
    yup.object().shape({
      branchIds: yup.array().of(yup.string()).required('Выберите филиал'),
      positionId: yup.string().required('Выберите должность'),
    }),
  ),
});
