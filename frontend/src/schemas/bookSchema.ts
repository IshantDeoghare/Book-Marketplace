import * as yup from 'yup';

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const bookSchema = yup.object().shape({
  title: yup.string().trim().min(3).required('Title is required'),
  author: yup.string().trim().min(3).required('Author is required'),
  mrp: yup.number().typeError('MRP must be a number').positive('MRP must be positive').required('MRP is required'),
  askingPrice: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Asking price is required')
    .lessThan(yup.ref('mrp'), 'Asking price cannot be more than MRP'),
  age: yup.string().required('Book age is required'),
  condition: yup.string().required('Book condition is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().trim().min(20, 'Description must be at least 20 characters').required('Description is required'),
  location: yup.string().trim().required('Location is required'),
  images: yup
    .mixed<FileList>()
    .test('required', 'Please upload at least one image', (value) => {
        return value != null && value.length > 0;
    })
    .test('fileSize', 'A file is too large', (value) => {
      if (!value) return true;
      for (let i = 0; i < value.length; i++) {
        if (value[i].size > MAX_FILE_SIZE) return false;
      }
      return true;
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value) return true;
      for (let i = 0; i < value.length; i++) {
        if (!SUPPORTED_FORMATS.includes(value[i].type)) return false;
      }
      return true;
    }),
});

// Define the TypeScript type based on the schema
export type BookFormData = yup.InferType<typeof bookSchema>;