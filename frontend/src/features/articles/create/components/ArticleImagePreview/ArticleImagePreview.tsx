'use client';


import Image from 'next/image';
import type { ChangeEvent } from 'react';
import { useRef } from 'react';


import css from './ArticleImagePreview.module.css';


type Props = {
 previewUrl: string;
 onChange: (file: File | null) => void;
 error?: string;
};


const ArticleImagePreview = ({
 previewUrl,
 onChange,
 error,
}: Props) => {
 const inputRef = useRef<HTMLInputElement>(null);


 const handleChange = (
   event: ChangeEvent<HTMLInputElement>,
 ) => {
   const file = event.target.files?.[0] ?? null;


   onChange(file);
 };


 const handleClick = () => {
   inputRef.current?.click();
 };


 return (
   <div className={css.wrapper}>
     <button
       type="button"
       className={css.preview}
       onClick={handleClick}
       aria-label="Choose article image"
     >
       {previewUrl ? (
         <Image
           src={previewUrl}
           alt="Article preview"
           fill
           unoptimized
           className={css.image}
         />
       ) : (
         <span
           className={css.cameraIcon}
           aria-hidden="true"
         >
           <span className={css.cameraLens} />
         </span>
       )}
     </button>


     <input
       ref={inputRef}
       type="file"
       accept="image/jpeg,image/png,image/webp"
       className={css.fileInput}
       onChange={handleChange}
     />


     {error && (
       <p className={css.error}>{error}</p>
     )}
   </div>
 );
};


export default ArticleImagePreview;
