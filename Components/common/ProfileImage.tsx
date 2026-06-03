'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

export const PROFILE_IMAGE_PLACEHOLDER = '/Portrait_Placeholder.png';

type ProfileImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string | null;
  alt: string;
};

const ProfileImage = ({ src, alt, onError, ...props }: ProfileImageProps) => {
  const fallbackSrc = src?.trim() || PROFILE_IMAGE_PLACEHOLDER;
  const [currentSrc, setCurrentSrc] = useState(fallbackSrc);

  useEffect(() => {
    setCurrentSrc(fallbackSrc);
  }, [fallbackSrc]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (currentSrc !== PROFILE_IMAGE_PLACEHOLDER) {
          setCurrentSrc(PROFILE_IMAGE_PLACEHOLDER);
        }

        onError?.(event);
      }}
    />
  );
};

export default ProfileImage;
