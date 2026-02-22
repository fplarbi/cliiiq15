import { toggleLikeMember } from '@/app/actions/likeActions';
import { useRouter } from 'next/navigation';
import React from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

type Props = {
    targetId: string;
    hasLiked: boolean ;
}

export default function likeButton({targetId, hasLiked}: Props) {
    const router = useRouter();

    async function togglelike() {
        await toggleLikeMember(targetId, hasLiked);
        router.refresh();
    }

  return (
    <div onClick={togglelike} className='relative hover:opacity-80 transition cursor-pointer'>
        <AiOutlineHeart size={28} className='fill-white absolute -top-0.5 -right-0.5'/>
        <AiFillHeart size={24} className={hasLiked ? 'fill-rose-500' : 'fill-neutral-500/70'} />
    </div>
  )
}
