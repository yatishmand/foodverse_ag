import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { createSampleImageBlob } from '../utils/sampleImages';

export default function ImageUploader({
  onImageSelected,
  selectedFile,
  previewUrl,
  onClear,
  samplePresets = [],
  presetType = 'food',
  label = 'Upload Food Image'
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragover' || e.type === 'dragenter') {
      setIsDragOver(true);
    } else if (e.type === 'dragleave') {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }
    const url = URL.createObjectURL(file);
    onImageSelected(file, url);
  };

  const handleSampleClick = async (title) => {
    const { file, previewUrl } = await createSampleImageBlob(presetType, title);
    onImageSelected(file, previewUrl);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {previewUrl ? (
        <div className="image-preview-box">
          <img src={previewUrl} alt="Preview" />
          <div className="preview-overlay">
            <button
              type="button"
              className="fv-btn fv-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.7)', color: '#fff' }}
              onClick={onClear}
              id="clear-image-btn"
            >
              <X size={15} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`upload-dropzone ${isDragOver ? 'dragover' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          id="dropzone-area"
        >
          <div className="dropzone-icon">
            <UploadCloud size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '4px' }}>
              {label}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              Drag and drop your photograph here, or <span style={{ color: 'var(--lime-500)', fontWeight: 600 }}>browse files</span>
            </p>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Supports JPG, PNG, WEBP (Up to 10 MB)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              className="fv-btn fv-btn-secondary"
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              id="browse-files-btn"
            >
              <ImageIcon size={15} />
              Choose File
            </button>
            <button
              type="button"
              className="fv-btn fv-btn-secondary"
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              id="capture-camera-btn"
            >
              <Camera size={15} />
              Capture Photo
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            id="file-input-element"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            id="camera-input-element"
          />
        </div>
      )}

      {/* Instant Viva Demo Sample Selectors */}
      {samplePresets && samplePresets.length > 0 && !previewUrl && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} color="var(--lime-500)" />
            Quick Viva Samples:
          </span>
          {samplePresets.map((preset) => (
            <button
              key={preset.title}
              type="button"
              className="preset-sample-btn"
              onClick={() => handleSampleClick(preset.title)}
              id={`preset-btn-${preset.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span>{preset.emoji}</span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
