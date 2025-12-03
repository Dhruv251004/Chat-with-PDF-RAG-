import React from 'react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Upload } from 'lucide-react';

const UploadArea = ({ onUpload, isUploading }) => {
	const [isDragging, setIsDragging] = useState(false);

	const handleDragEnter = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};
	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};
	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files.length > 0) {
			const file = files[0];
			if (file.type === 'application/pdf') {
				onUpload(file);
			} else {
				console.error('File type not supported. Please upload a PDF file.');
			}
		}
	};

	const handleFileInput = (e) => {
		const files = e.target.files;
		if (files.length > 0) {
			const file = files[0];
			if (file.type === 'application/pdf') {
				onUpload(file);
			} else {
				console.error('File type not supported. Please upload a PDF file.');
			}
		}
	};

	return (
		<div className='flex-1 flex items-center justify-center p-4 sm:p-8 bg-gray-100 transition-colors duration-300'>
			<div
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				className={`w-full max-w-xl p-8 sm:p-16 border-4 border-dashed rounded-3xl transition-all duration-300 transform ${
					isDragging
						? 'border-blue-500 bg-blue-50 shadow-2xl shadow-blue-500/30'
						: 'border-gray-300 bg-white shadow-xl hover:shadow-2xl'
				}`}>
				<div className='flex flex-col items-center text-center'>
					<Upload
						className={`w-12 h-12 sm:w-16 sm:h-16 mb-4 transition-colors ${
							isDragging ? 'text-blue-600' : 'text-gray-400'
						}`}
					/>
					<h2 className='text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2'>
						Chat with Any PDF
					</h2>
					<p className='text-gray-600 mb-8 text-sm sm:text-base'>
						Drag & drop your PDF here, or click to browse.
						<br />
						Start asking questions immediately after processing.
					</p>

					<label
						htmlFor='pdf-upload'
						className={`inline-flex items-center justify-center px-8 sm:px-10 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 cursor-pointer ${
							isUploading
								? 'opacity-50 cursor-not-allowed pointer-events-none'
								: ''
						}`}>
						{isUploading ? (
							<>
								<Loader2 className='w-5 h-5 mr-2 animate-spin' />
								Processing PDF...
							</>
						) : (
							'Choose PDF File'
						)}
					</label>
					<input
						id='pdf-upload'
						type='file'
						accept='.pdf,application/pdf'
						onChange={handleFileInput}
						disabled={isUploading}
						className='hidden'
					/>

					<p className='text-xs text-gray-500 mt-4'>Max file size: 10MB.</p>
				</div>
			</div>
		</div>
	);
};
export default UploadArea;
