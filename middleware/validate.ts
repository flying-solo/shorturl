import * as Yup from 'yup';

export const urlValidate = Yup.object().shape({
    url: Yup.string().url().required()
})