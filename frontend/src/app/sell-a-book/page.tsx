"use client";
import { GridLegacy as Grid } from '@mui/material';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import {
  Container, Paper, Typography, Box, 
   Button, Alert,
  CircularProgress, IconButton, useTheme, alpha
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { bookSchema, BookFormData } from '@/schemas/bookSchema';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';

// --- API Functions ---
const getUploadUrl = async (fileType: string, token: string) => (await apiClient.post('/books/upload-url', { fileType }, { headers: { Authorization: `Bearer ${token}` } })).data;
const uploadToS3 = (uploadUrl: string, file: File) => axios.put(uploadUrl, file, { headers: { 'Content-Type': file.type } });
const createListing = async (data: Omit<BookFormData, 'images'> & { imageUrls: string[] }, token: string) => (await apiClient.post('/books', data, { headers: { Authorization: `Bearer ${token}` } })).data;


// --- DropZone Component ---
function DropZone({ onFilesChange, error }: {
  onFilesChange: (files: File[]) => void;
  error?: string;
}) {
  const theme = useTheme();
  const [drag, setDrag] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (newFiles: File[]) => {
    const limitedFiles = newFiles.slice(0, 5);
    setFiles(limitedFiles);
    onFilesChange(limitedFiles);

    const newPreviews = limitedFiles.map(file => URL.createObjectURL(file));
    // Clean up old previews before setting new ones
    previews.forEach(p => URL.revokeObjectURL(p));
    setPreviews(newPreviews);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files) handleFileChange(Array.from(e.dataTransfer.files));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFileChange(Array.from(e.target.files));
  };
  
  const removeFile = (indexToRemove: number) => {
    URL.revokeObjectURL(previews[indexToRemove]);
    const remainingFiles = files.filter((_, i) => i !== indexToRemove);
    setFiles(remainingFiles);
    onFilesChange(remainingFiles);
    setPreviews(previews.filter((_, i) => i !== indexToRemove));
  };

  return (
    <Paper
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      sx={{
        p: 4, textAlign: 'center',
        border: `2px dashed ${drag ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.2)}`,
        borderRadius: 4, bgcolor: drag ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
        transition: 'all .3s', cursor: 'pointer',
      }}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <CloudUpload sx={{ fontSize: 48, mb: 1, color: theme.palette.primary.main }} />
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        {drag ? 'Release to Upload' : 'Drag & Drop or Click to Upload'}
      </Typography>
      <Typography variant="caption" color="text.secondary">Max 5 images</Typography>
      <input id="fileInput" type="file" hidden multiple accept="image/*" onChange={handleInputChange} />
      {error && <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>{error}</Alert>}
      {previews.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {previews.map((src, i) => (
            <Grid item xs={6} sm={4} md={2.4} key={i}>
              <Box sx={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 2, overflow: 'hidden', '&:hover .overlay': { opacity: 1 } }}>
                <Image src={src} alt={`Preview ${i + 1}`} fill sizes="150px" style={{ objectFit: 'cover' }} />
                <Box className="overlay" sx={{
                  position: 'absolute', inset: 0, bgcolor: alpha('#000', 0.6),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity .2s',
                }}>
                  <IconButton sx={{color: 'white'}} onClick={e => { e.stopPropagation(); removeFile(i); }}>
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}

// --- Main Page Component ---
export default function SellABookPage() {
  const { user, idToken } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const {
    register, handleSubmit, control, watch, setValue, formState: { errors }
  } = useForm<BookFormData>({
    resolver: yupResolver(bookSchema),
    defaultValues: { condition: 'Good', age: '1-3 years', images: [] }, // Set images default to empty array
  });

  const createMutation = useMutation({
    mutationFn: async (form: BookFormData) => {
      if (!idToken) throw new Error('Please log in again.');
      if (!form.images || form.images.length === 0) throw new Error('No images selected.');
      
      const urls: string[] = [];
      for (const file of form.images) {
        // Add a check to ensure the file is valid before proceeding
        if (file instanceof File) {
          const { uploadUrl, key } = await getUploadUrl(file.type, idToken);
          await uploadToS3(uploadUrl, file);
          urls.push(`https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`);
        }
      }
      const { images, ...data } = form;
      return createListing({ ...data, imageUrls: urls }, idToken);
    },
    onSuccess: (book) => router.push(`/books/${book._id}`),
  });

  if (!user) {
    return (
      <Container sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h5" gutterBottom>Sign-in required to list a book</Typography>
        <Button variant="contained" component={Link} href="/login">Go to Login</Button>
      </Container>
    );
  }

  const mrp = watch('mrp');
  const askingPrice = watch('askingPrice');
  const priceDiff = mrp && askingPrice ? Math.max(Number(mrp) - Number(askingPrice), 0) : 0;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 2, md: 5 }, borderRadius: 4, bgcolor: alpha(theme.palette.background.paper, 0.6), backdropFilter: 'blur(12px)', }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Sell Your Book</Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Fill in the details and share your book with thousands of readers.
        </Typography>

        {createMutation.isError && <Alert severity="error" sx={{ mb: 3 }}>{(createMutation.error as Error).message}</Alert>}

        <Box component="form" noValidate onSubmit={handleSubmit((d) => createMutation.mutate(d))}>
          <Grid container spacing={3}>
            {/* ... All your TextField and Select Grid items ... */}
            <Grid item xs={12}>
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <DropZone
                    onFilesChange={(files) => setValue('images', files, { shouldValidate: true })}
                    error={errors.images?.message}
                  />
                )}
              />
            </Grid>
            {priceDiff > 0 && Number(mrp) > 0 && (
              <Grid item xs={12}>
                <Alert severity="success">
                  Great deal! Buyers save ₹{priceDiff.toLocaleString('en-IN')} ({Math.round((priceDiff / Number(mrp)) * 100)}% off MRP)
                </Alert>
              </Grid>
            )}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              disabled={createMutation.isPending}
              startIcon={createMutation.isPending ? <CircularProgress size={20} color="inherit" /> : undefined}
              sx={{ /* ... your button styling ... */ }}
            >
              {createMutation.isPending ? 'Creating Listing...' : 'Create Listing'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}