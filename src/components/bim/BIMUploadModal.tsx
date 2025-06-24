
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BIMUploadModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BIMUploadModal: React.FC<BIMUploadModalProps> = ({
  projectId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['.ifc', '.gltf', '.glb'];
      const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
      
      if (!fileExtension || !allowedTypes.includes(`.${fileExtension}`)) {
        setError('Please select a valid IFC, GLTF, or GLB file');
        return;
      }

      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError('File size must be less than 100MB');
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    setError(null);

    try {
      // Generate unique file path
      const fileExtension = file.name.split('.').pop();
      const filePath = `${projectId}/${Date.now()}_${file.name}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('bim_models')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get file type
      const fileType = fileExtension?.toLowerCase() === 'ifc' ? 'ifc' : 'gltf';

      // Deactivate previous models
      await supabase
        .from('bim_files')
        .update({ is_active: false })
        .eq('project_id', projectId);

      // Insert new BIM file record
      const { error: dbError } = await supabase
        .from('bim_files')
        .insert({
          project_id: projectId,
          filename: file.name,
          file_path: filePath,
          file_type: fileType,
          file_size: file.size,
          uploaded_by: user.id,
          is_active: true
        });

      if (dbError) throw dbError;

      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload 3D Model
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="bim-file">Select BIM File</Label>
            <Input
              id="bim-file"
              type="file"
              accept=".ifc,.gltf,.glb"
              onChange={handleFileChange}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supported formats: IFC, GLTF, GLB (max 100MB)
            </p>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-700">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BIMUploadModal;
